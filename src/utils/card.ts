// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {config} from "../config/config.ts";
import {decrypt3DESCBC, encrypt3DESCBC} from "./crypto.ts";

const KEYHEX = config.BMN_CARD_KEY;
const KEY = Buffer.from(KEYHEX, "hex");

const VALID_CHARS = "0123456789ABCDEFGHJKLMNPRSTUWXYZ";
const REVERSE_CHARS: Record<string, number> = VALID_CHARS.split("").reduce((acc, char, index) => {
	acc[char] = index;
	return acc;
}, {} as Record<string, number>);

const CONV_CHARS: Record<string, string> = {
	"I": "1",
	"O": "0",
};

function typeFromCardId(cardId: string): number {
	if (cardId.slice(0, 4).toUpperCase() === "E004") {
		return 1;
	}
	if (cardId[0] === "0") {
		return 2;
	}
	throw new Error("Unrecognized card type");
}

// https://bsnk.me/eamuse/cardid.html
export function encode(cardId: string): string {
	if (cardId.length !== 16) {
		throw new Error(`Expected 16-character card ID, got ${cardId.length}`);
	}

	const cardBytes = Buffer.from(cardId, "hex");
	const reverse = Buffer.from(cardBytes).reverse();

	const ciphered = encrypt3DESCBC(reverse, KEY, Buffer.alloc(0));

	const bits: number[] = new Array(65).fill(0);
	for (let i = 0; i < 64; i++) {
		bits[i] = (ciphered[Math.floor(i / 8)] >> (7 - (i % 8))) & 1;
	}

	const groups: number[] = new Array(16).fill(0);
	for (let i = 0; i < 13; i++) {
		groups[i] =
            ((bits[i * 5 + 0] << 4) |
            (bits[i * 5 + 1] << 3) |
            (bits[i * 5 + 2] << 2) |
            (bits[i * 5 + 3] << 1) |
            (bits[i * 5 + 4] << 0));
	}

	groups[13] = 1;
	groups[0] ^= typeFromCardId(cardId);

	for (let i = 0; i < 14; i++) {
		groups[i] ^= groups[i - 1];
	}

	groups[14] = typeFromCardId(cardId);
	groups[15] = checksum(groups);

	return groups.map(i => VALID_CHARS[i]).join("");
}

export function decode(cardId: string): string {
	cardId = cardId.replace(/[\s-]/g, "").toUpperCase();
	for (const c in CONV_CHARS) {
		cardId = cardId.replace(new RegExp(c, "g"), CONV_CHARS[c]);
	}

	if (cardId.length !== 16) {
		throw new Error(`Expected 16-character card ID, got ${cardId.length}`);
	}

	for (const c of cardId) {
		if (!(c in REVERSE_CHARS)) {
			throw new Error(`Got unexpected character ${c} in card ID`);
		}
	}

	const groups: number[] = cardId.split("").map(c => REVERSE_CHARS[c]);

	if (groups[14] !== 1 && groups[14] !== 2) {
		throw new Error("Unrecognized card type");
	}
	if (groups[15] !== checksum(groups)) {
		throw new Error("Bad card number");
	}

	for (let i = 13; i > 0; i--) {
		groups[i] ^= groups[i - 1];
	}
	groups[0] ^= groups[14];

	const bits: number[] = new Array(64).fill(0);
	for (let i = 0; i < 64; i++) {
		bits[i] = (groups[Math.floor(i / 5)] >> (4 - (i % 5))) & 1;
	}

	const ciphered = Buffer.alloc(8);
	for (let i = 0; i < 64; i++) {
		ciphered[Math.floor(i / 8)] |= bits[i] << (7 - (i % 8));
	}

	const decipher = decrypt3DESCBC(ciphered, KEY, Buffer.alloc(0));
	const deciphered = Buffer.from(decipher);
	const reverse = Buffer.from(deciphered).reverse();

	const finalValue = reverse.toString("hex").toUpperCase();
	if (groups[14] !== typeFromCardId(finalValue)) {
		throw new Error("Card type mismatch");
	}
	return finalValue;
}

function checksum(data: number[]): number {
	let sum = 0;
	for (let i = 0; i < 15; i += 3) {
		sum += data[i] * 1;
	}
	for (let i = 1; i < 15; i += 3) {
		sum += data[i] * 2;
	}
	for (let i = 2; i < 15; i += 3) {
		sum += data[i] * 3;
	}

	while (sum >= 0x20) {
		const div = Math.floor(sum / 0x20);
		const mod = sum % 0x20;
		sum = div + mod;
	}

	return sum;
}