/* eslint-disable */

import * as crypto from "crypto";
import * as net from "net";
import * as util from "util";
import {log} from "../helpers/general.ts";
import {ADBBaseResponse, ADBHeader} from "./adb/base.ts";
import {ADBLookupRequest} from "./adb/lookup.ts";
import {generateExternalId} from "../helpers/aime.ts";
import {Card} from "../games/common/models/card.model.ts";
import type {CardType} from "../games/common/types/card.types.ts";

type Dict<T> = { [key: number]: T };
type Callable = (...args: any[]) => any;
type Optional<T> = T | undefined;

type CoreConfig = {
    aimedb: {
        key: string;
        port: number;
        listen_address?: string;
        loglevel: string;
        id_secret?: string;
        id_lifetime_seconds?: number;
    };
    server: {
        listen_address?: string;
        log_dir: string;
        allow_user_registration: boolean;
    };
}

class AimedbServlette {
	request_list: Dict<[Callable, number, string]> = {};
	config: CoreConfig;

	constructor(core_cfg: CoreConfig) {
		this.config = core_cfg;

		if (!core_cfg.aimedb.key) {
			log("error", "!!!KEY NOT SET!!!");
			process.exit(1);
		}

		this.register_handler(0x01, 0x03, this.handle_felica_lookup.bind(this), "felica_lookup");
		this.register_handler(0x02, 0x03, this.handle_felica_register.bind(this), "felica_register");
		this.register_handler(0x04, 0x06, this.handle_lookup.bind(this), "lookup");
		this.register_handler(0x05, 0x06, this.handle_register.bind(this), "register");
		this.register_handler(0x07, 0x08, this.handle_status_log.bind(this), "status_log");
		this.register_handler(0x09, 0x0A, this.handle_log.bind(this), "aime_log");
		this.register_handler(0x0B, 0x0C, this.handle_campaign.bind(this), "campaign");
		this.register_handler(0x0D, 0x0E, this.handle_campaign_clear.bind(this), "campaign_clear");
		this.register_handler(0x0F, 0x10, this.handle_lookup_ex.bind(this), "lookup_ex");
		this.register_handler(0x11, 0x12, this.handle_felica_lookup_ex.bind(this), "felica_lookup_ex");
		this.register_handler(0x13, 0x14, this.handle_log_ex.bind(this), "aime_log_ex");
		this.register_handler(0x64, 0x65, this.handle_hello.bind(this), "hello");
	}

	register_handler(cmd: number, resp: number, handler: Callable, name: string): void {
		this.request_list[cmd] = [handler, resp, name];
	}

	start(): void {
		log("aime", `Started on port ${this.config.aimedb.port}`);
		const addr = this.config.aimedb.listen_address || this.config.server.listen_address;
		const server = net.createServer((socket) => {
			this.dataReceived(socket);
		});
		server.listen(this.config.aimedb.port, addr);
	}

	async dataReceived(socket: net.Socket) {
		log("aime", `Connection made from ${socket.remoteAddress}`);
		socket.on("data", async (data: Buffer) => {
			await this.process_data(data, socket);
		});
		socket.on("close", () => {
			log("aime", "Connection closed");
		});
		socket.on("error", (err) => {
			log("error", `Aime connection error: ${err}`);
		});
	}

	async process_data(data: Buffer, socket: net.Socket): Promise<Optional<Buffer>> {
		const addr = socket.remoteAddress;

		const decipher = crypto.createDecipheriv("aes-128-ecb", Buffer.from(this.config.aimedb.key, "utf-8"), null);

		decipher.setAutoPadding(false);

		let decrypted: Buffer;
		try {
			decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
		} catch (e) {
			log("error", `Failed to decrypt ${data.toString("hex")} because ${e}`);
			return;
		}

		let head: ADBHeader;

		try{
			head = ADBHeader.from_data(decrypted);
		} catch(e){
			try{
				log("error", `Error parsing ADB header: ${e}`);
				const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(this.config.aimedb.key, "utf-8"), null);
				cipher.setAutoPadding(false);
				const encrypted = Buffer.concat([cipher.update(Buffer.alloc(32)), cipher.final()]);
				socket.write(encrypted);
				return;
			}catch (e){
				log("error", `Failed to encrypt default response because ${e}`);
				return;
			}
		}

		if (head.keychip_id === "ABCD1234567" || head.store_id === 0xfff0) {
			log("aime", `Request from uninitialized AMLib: ${util.inspect(head)}`);
		}

		if (head.cmd === 0x66) {
			log("aime", "Goodbye");
			socket.end();
			return;
		}

		const [handler, resp_code, name] = this.request_list[head.cmd] || [this.handle_default.bind(this), null, "default"];

		if (resp_code === null) {
			log("error", `No handler for cmd ${head.cmd.toString(16)}`);
			return;
		} else if (resp_code > 0) {
			log("aimePath", `/${name} from ${head.keychip_id} (${head.game_id}) @ ${addr}`);
		}

		const resp = await handler(decrypted, resp_code);

		let resp_bytes: Buffer;
		if (resp instanceof ADBBaseResponse || (resp && resp instanceof Object && "make" in resp && typeof resp.make === "function")) {
			resp_bytes = resp.make();
		} else if (resp instanceof Buffer) {
			resp_bytes = resp;
		} else if (resp === null || resp === undefined) {
			log("error", `None return by handler for ${name}`);
			return;
		} else {
			log("error", `Unsupported type returned by ADB handler for ${name}: ${typeof resp}`);
			throw new TypeError(`Unsupported type returned by ADB handler for ${name}: ${typeof resp}`);
		}

		try {
			const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(this.config.aimedb.key, "utf-8"), null);
			cipher.setAutoPadding(false);
			const encrypted = Buffer.concat([cipher.update(resp_bytes), cipher.final()]);
			socket.write(encrypted);
		} catch (e) {
			log("error", `Failed to encrypt ${resp_bytes.toString("hex")} because ${e}`);
		}
	}

	async handle_default(data: Buffer, resp_code: number, length: number = 0x20): Promise<any> {
		const response = Buffer.alloc(length)

		response.writeUInt16LE(0x0c,0x04)
		response.writeUInt16LE(1,0x08)

		return response;
	}

	async handle_hello(data: Buffer, resp_code: number): Promise<any> {
		const response = Buffer.alloc(0x20)
		response.writeUInt16LE(0x65,0x04)
		response.writeUInt16LE(1,0x08)

		return response;
	}

	async handle_campaign(data: Buffer, resp_code: number): Promise<any> {
		const response = Buffer.alloc(0x200)

		response.writeUInt16LE(0x0c,0x04)
		response.writeUInt16LE(1,0x08)
		response.writeUInt16LE(0x6f,0x20)
		response.writeUInt16LE(1,0x24)

		return response;
	}

	async handle_lookup(data: Buffer, resp_code: number): Promise<any> {
		// Implement logic
		return {};
	}
	async handle_lookup_ex(data: Buffer, resp_code: number): Promise<any> {
		const req = new ADBLookupRequest(data);

		let userId = -1;
		const foundCard = await Card.findOne({accessCode:req.access_code});

		if(foundCard){
			userId = parseInt(foundCard.extId);
		}

		const response = Buffer.alloc(0x130)

		response.writeUInt16LE(0x10,0x04)
		response.writeUInt16LE(1,0x08)
		response.writeBigInt64LE(BigInt(userId),0x20)
		response.writeUInt8(0,0x24)

		return response;
	}
	async handle_felica_lookup(msg: Buffer, resp_code: number): Promise<any> {
		const idm = msg.readBigUInt64BE(0x20);

		const accessCode = idm.toString().replace("-", "").padStart(20, "0");

		log("aime", `> Response: ${accessCode}`);

		const response = Buffer.alloc(0x30);

		response.writeUInt16LE(0x03, 0x04);
		response.writeUInt16LE(1, 0x08);
		Buffer.from(accessCode, "hex").copy(response, 0x24);

		return response;
	}
	async handle_felica_register(data: Buffer, resp_code: number): Promise<any> {
		// Implement logic
		return {};
	}
	async handle_felica_lookup_ex(data: Buffer, resp_code: number): Promise<any> {
		// Implement logic
		return {};
	}
	async handle_campaign_clear(data: Buffer, resp_code: number): Promise<any> {
		const response = Buffer.alloc(0x50)

		response.writeUInt16LE(0x0e,0x04)
		response.writeUInt16LE(1,0x08)
		response.writeUInt16LE(0x6f,0x20)
		response.writeUInt16LE(1,0x24)

		return response;
	}
	async handle_register(data: Buffer, resp_code: number): Promise<any> {
		const req = new ADBLookupRequest(data);
		const accessCode = req.access_code;

		const foundCard = await Card.findOne({accessCode});

		let status = 0;
		let userId = "0";

		if(!foundCard){
			status=1;
			userId = generateExternalId(accessCode);

			const newCard:CardType = {
				accessCode,
				extId:userId,
				registerDate:new Date(),
				lastLoginDate:new Date(),
				status:"good",
				userId:null
			};

			await Card.create(newCard);
			log("aime", `Registered new card ${accessCode}`);
		}else {
			log("error", `Card already exists for ${accessCode}`);
		}

		const response = Buffer.alloc(0x30)

		response.writeUInt16LE(0x06,0x04)
		response.writeUInt16LE(status,0x08)
		response.writeBigInt64LE(BigInt(userId),0x20)

		return response;
	}
	async handle_status_log(data: Buffer, resp_code: number): Promise<any> {
		// Implement logic
		return {};
	}
	async handle_log(data: Buffer, resp_code: number): Promise<any> {
		const response = Buffer.alloc(0x20)

		response.writeUInt16LE(0x0a,0x04)
		response.writeUInt16LE(1,0x08)

		return response;
	}
	async handle_log_ex(data: Buffer, resp_code: number): Promise<any> {
		const response = Buffer.alloc(0x40)

		response.writeUInt16LE(0x14,0x04)
		response.writeUInt16LE(1,0x08)

		return response;
	}
}

export { AimedbServlette };