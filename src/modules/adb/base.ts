type Union<T, U> = T | U;

export class LogStatus {
	static NONE = 0;
	static START = 1;
	static CONTINUE = 2;
	static END = 3;
	static OTHER = 4;
}

export const PortalRegStatus = {
	NO_REG: 0,
	PORTAL: 1,
	SEGA_ID: 2
};

export const CompanyCodes = {
	NONE: 0,
	SEGA: 1,
	BAMCO: 2,
	KONAMI: 3,
	TAITO: 4
};

export class ReaderFwVer {
	static NONE = 0;
	static TN32_10 = 1;
	static TN32_12 = 2;
	static OTHER = 9;

	static toString(ver: number): string {
		switch (ver) {
		case ReaderFwVer.TN32_10:
			return "TN32MSEC003S F/W Ver1.0";
		case ReaderFwVer.TN32_12:
			return "TN32MSEC003S F/W Ver1.2";
		case ReaderFwVer.NONE:
			return "Not Specified";
		case ReaderFwVer.OTHER:
			return "Unknown/Other";
		default:
			throw new Error(`Bad ReaderFwVer value ${ver}`);
		}
	}

	static fromByte(byte: Buffer): number {
		try {
			return byte.readUInt8(0);
		} catch {
			return ReaderFwVer.NONE;
		}
	}
}

export class ADBHeaderException extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ADBHeaderException";
	}
}

export const HEADER_SIZE = 0x20;
const CMD_CODE_GOODBYE = 0x66;

export class ADBHeader {
	magic: number;
	protocol_ver: number;
	cmd: number;
	length: number;
	status: number;
	game_id: string;
	store_id: number;
	keychip_id: string;

	constructor(magic: number, protocol_ver: number, cmd: number, length: number, status: number, game_id: Union<string, Buffer>, store_id: number, keychip_id: Union<string, Buffer>) {
		this.magic = magic; // u16
		this.protocol_ver = protocol_ver; // u16
		this.cmd = cmd; // u16
		this.length = length; // u16
		this.status = status; // u16
		this.game_id = typeof game_id === "string" ? game_id : game_id.toString("utf-8"); // 4 char + \x00
		this.store_id = store_id; // u32
		this.keychip_id = typeof keychip_id === "string" ? keychip_id : keychip_id.toString("utf-8"); // 11 char + \x00

		this.game_id = this.game_id.replace("\0", "");
		this.keychip_id = this.keychip_id.replace("\0", "");
	}

	static from_data(data: Buffer): ADBHeader {
		if (data.length < 32) {
			throw new Error("Data too short to be a valid ADBHeader");
		}
		const magic = data.readUInt16LE(0);
		const protocol_ver = data.readUInt16LE(2);
		const cmd = data.readUInt16LE(4);
		const length = data.readUInt16LE(6);
		const status = data.readUInt16LE(8);
		const game_id = data.slice(10, 14).toString("utf-8");
		const store_id = data.readUInt32LE(14);
		const keychip_id = data.slice(18, 29).toString("utf-8").replace(/[^\x20-\x7E]/g, "");

		return new ADBHeader(magic, protocol_ver, cmd, length, status, game_id, store_id, keychip_id);
	}

	validate(): boolean {
		if (this.magic !== 0xa13e) {
			throw new ADBHeaderException(`Magic ${this.magic} != 0xa13e`);
		}

		if (this.protocol_ver < 0x1000) {
			throw new ADBHeaderException(`Protocol version ${this.protocol_ver.toString(16)} is invalid!`);
		}

		if (!/^S[0-9A-Z]{3}[P]?$/.test(this.game_id)) {
			throw new ADBHeaderException(`Game ID ${this.game_id} is invalid!`);
		}

		if (!/^A[0-9A-Z]{8}$/.test(this.keychip_id)) {
			throw new ADBHeaderException(`Keychip ID ${this.keychip_id} is invalid!`);
		}

		return true;
	}

	make(): Buffer {
		const buffer = Buffer.alloc(HEADER_SIZE);
		buffer.writeUInt16LE(this.magic, 0);
		buffer.writeUInt16LE(this.protocol_ver, 2);
		buffer.writeUInt16LE(this.cmd, 4);
		buffer.writeUInt16LE(this.length, 6);
		buffer.writeUInt16LE(this.status, 8);
		buffer.write(this.game_id, 10, 4, "utf-8");
		buffer.writeUInt32LE(this.store_id, 14);
		buffer.write(this.keychip_id, 18, 11, "utf-8");
		return buffer;
	}
}

export class ADBBaseRequest {
	head: ADBHeader;

	constructor(data: Buffer) {
		this.head = ADBHeader.from_data(data);
		if (this.head.cmd !== CMD_CODE_GOODBYE) { // Games for some reason send no data with goodbye
			this.head.validate();
		}
		if (this.head.length > data.length) {
			throw new ADBHeaderException(`Length is incorrect! Expect ${this.head.length}, got ${data.length}`);
		}
	}
}

export class ADBBaseResponse {
	head: ADBHeader;

	constructor(code: number = 0, length: number = 0x20, status: number = 1, game_id: string = "SXXX", store_id: number = 1, keychip_id: string = "A69E01A8888", protocol_ver: number = 0x3087) {
		this.head = new ADBHeader(0xa13e, protocol_ver, code, length, status, game_id, store_id, keychip_id);
	}

	static from_req(req: ADBHeader, cmd: number, length: number = 0x20, status: number = 1): ADBBaseResponse {
		return new ADBBaseResponse(cmd, length, status, req.game_id, req.store_id, req.keychip_id, req.protocol_ver);
	}

	append_padding(data: Buffer): Buffer {
		// Appends 0s to the end of the data until it's at the correct size
		const padding_size = this.head.length - data.length;
		const padding = Buffer.alloc(padding_size);
		return Buffer.concat([data, padding]);
	}

	make(): Buffer {
		return this.head.make();
	}
}