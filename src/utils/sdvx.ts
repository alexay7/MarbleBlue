import {to_bin, to_xml} from "@kamyu/kbinxml";
import crypto from "crypto";
import rc4 from "arc4";
import * as lz77 from "@kamyu/lz77";
import type {Request, Response} from "express";
import {Builder} from "xml2js";
import {config} from "../config/config.ts";

const hexKey = config.BMN_ENC_KEY;
const internalKey = Buffer.from(hexKey, "hex");

const INITIAL_STATE = 0x41c64e6d >>> 0;

const SESSION_CLIENTS:Record<string, number> = {};

function prng(clientId:string): number {
	if (!(clientId in SESSION_CLIENTS)) {
		SESSION_CLIENTS[clientId] = INITIAL_STATE;
	}

	let PRNG_STATE = SESSION_CLIENTS[clientId]!;

	const upper =
		(Math.imul(PRNG_STATE, 0x838c9cda) + 0x6072) >>> 0;

	PRNG_STATE =
		(Math.imul(
			(Math.imul(PRNG_STATE, 0x41c64e6d) + 0x3039) >>> 0,
			0x41c64e6d
		) + 0x3039) >>> 0;

	// I don't update the value because I don't understand how the prng works and I don't care about encryption
	return ((upper & 0x7fff0000) | ((PRNG_STATE >>> 15) & 0xffff)) >>> 0;
}

export function decodeKNMXML(sdvxBody:string, compressed:string, hexTime?:string, hexPrng?:string){
	const binaryBody = Buffer.from(sdvxBody, "base64");

	if(!hexTime || !hexPrng) return to_xml(binaryBody).data;

	// Primero desencripta la petición
	const bytesTime = Buffer.from(hexTime, "hex");
	const bytesPrng = Buffer.from(hexPrng, "hex");

	const key = crypto.createHash("md5").update(Buffer.concat([bytesTime, bytesPrng, internalKey])).digest();

	let decrypted = rc4("arc4", key).decodeBuffer(binaryBody);

	// Después descomprime en caso de ser necesario
	if(compressed === "lz77") {
		decrypted = Buffer.from(lz77.decompress(decrypted));
	}

	// Finalmente convierte el bin a un xml legible
	const finalXml = to_xml(decrypted);

	// parseString(finalXml.data, (err, result) => {
	// 	if (err) {
	// 		log("error", `Failed to parse XML: ${err.message}`);
	// 	} else {
	// 	// 	save to json file
	// 		fs.writeFileSync("sdvx_common.json", JSON.stringify(result, null, 2));
	// 	}
	// });

	return finalXml.data;
}

export function encodeKNMXML(req:Request, res:Response, body:string, compress="none", encrypt=false){
	const xmlBuilder = new Builder({renderOpts: {pretty: false}});

	const xml = (req.query.f as string).includes("shop") ? xmlBuilder.buildObject({call:JSON.parse(body)}) : xmlBuilder.buildObject({response:JSON.parse(body)});

	// Primero crea el binario del xml
	const binXml = to_bin(xml);
	let encodedBuffer = Buffer.from(binXml.data);

	// Después comprime si es necesario
	if(compress === "lz77") {
		res.setHeader("x-compress", "lz77");
		encodedBuffer = Buffer.from(lz77.compress(encodedBuffer));
	}

	// Finalmente encripta si es necesario
	if (encrypt) {
		const version = 1;
		const unixTime = Math.floor(Date.now() / 1000);

		const pcbId = req.body.$.srcid;

		const salt = prng(pcbId) & 0xffff;

		res.setHeader("x-eamuse-info", `${version}-${unixTime.toString(16).padStart(4, "0")}-${salt.toString(16).padStart(2, "0")}`);

		const timeBuffer = Buffer.alloc(4);
		timeBuffer.writeUInt32BE(unixTime, 0);
		const prngBuffer = Buffer.alloc(2);
		prngBuffer.writeUInt16BE(salt, 0);

		const key = crypto.createHash("md5").update(Buffer.concat([timeBuffer, prngBuffer, internalKey])).digest();

		const encrypted = rc4("arc4", key).encodeBuffer(encodedBuffer);

		return {
			data: encrypted,
			encrypted: true
		};
	} else {
		return {
			data: encodedBuffer,
			encrypted: false
		};
	}
}

export function getWeekNumber (date: Date) {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// parseString(decodeKNMXML("", "none", "6a73de60", "acdc"), {explicitArray: false, explicitRoot: false}, (err, result) => {
// 	if (err) {
// 		log("error", `Error parsing XML: ${err.message}`);
// 	} else {
// 		console.log(util.inspect(result, {depth: null}));
// 	}
// });