// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const IP = [
	58, 50, 42, 34, 26, 18, 10, 2,
	60, 52, 44, 36, 28, 20, 12, 4,
	62, 54, 46, 38, 30, 22, 14, 6,
	64, 56, 48, 40, 32, 24, 16, 8,
	57, 49, 41, 33, 25, 17, 9, 1,
	59, 51, 43, 35, 27, 19, 11, 3,
	61, 53, 45, 37, 29, 21, 13, 5,
	63, 55, 47, 39, 31, 23, 15, 7
];

const FP = [
	40, 8, 48, 16, 56, 24, 64, 32,
	39, 7, 47, 15, 55, 23, 63, 31,
	38, 6, 46, 14, 54, 22, 62, 30,
	37, 5, 45, 13, 53, 21, 61, 29,
	36, 4, 44, 12, 52, 20, 60, 28,
	35, 3, 43, 11, 51, 19, 59, 27,
	34, 2, 42, 10, 50, 18, 58, 26,
	33, 1, 41, 9, 49, 17, 57, 25
];

const E = [
	32, 1, 2, 3, 4, 5,
	4, 5, 6, 7, 8, 9,
	8, 9, 10, 11, 12, 13,
	12, 13, 14, 15, 16, 17,
	16, 17, 18, 19, 20, 21,
	20, 21, 22, 23, 24, 25,
	24, 25, 26, 27, 28, 29,
	28, 29, 30, 31, 32, 1
];

const P = [
	16, 7, 20, 21,
	29, 12, 28, 17,
	1, 15, 23, 26,
	5, 18, 31, 10,
	2, 8, 24, 14,
	32, 27, 3, 9,
	19, 13, 30, 6,
	22, 11, 4, 25
];

const S_BOXES: number[][][] = [
	[
		[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
		[0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
		[4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
		[15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
	],
	[
		[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
		[3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
		[0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
		[13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
	],
	[
		[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
		[13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
		[13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
		[1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
	],
	[
		[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
		[13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
		[10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
		[3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
	],
	[
		[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
		[14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
		[4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
		[11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
	],
	[
		[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
		[10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
		[9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
		[4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
	],
	[
		[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
		[13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
		[1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
		[6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
	],
	[
		[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
		[1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
		[7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
		[2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
	]
];

const PC1 = [
	57, 49, 41, 33, 25, 17, 9,
	1, 58, 50, 42, 34, 26, 18,
	10, 2, 59, 51, 43, 35, 27,
	19, 11, 3, 60, 52, 44, 36,
	63, 55, 47, 39, 31, 23, 15,
	7, 62, 54, 46, 38, 30, 22,
	14, 6, 61, 53, 45, 37, 29,
	21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
	14, 17, 11, 24, 1, 5,
	3, 28, 15, 6, 21, 10,
	23, 19, 12, 4, 26, 8,
	16, 7, 27, 20, 13, 2,
	41, 52, 31, 37, 47, 55,
	30, 40, 51, 45, 33, 48,
	44, 49, 39, 56, 34, 53,
	46, 42, 50, 36, 29, 32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function bytesToBits(bytes: Uint8Array): number[] {
	const bits: number[] = new Array(bytes.length * 8);
	for (let i = 0; i < bytes.length; i++) {
		for (let b = 0; b < 8; b++) {
			bits[i * 8 + b] = (bytes[i] >> (7 - b)) & 1;
		}
	}
	return bits;
}

function bitsToBytes(bits: number[]): Uint8Array {
	const bytes = new Uint8Array(bits.length / 8);
	for (let i = 0; i < bytes.length; i++) {
		let v = 0;
		for (let b = 0; b < 8; b++) v = (v << 1) | bits[i * 8 + b];
		bytes[i] = v;
	}
	return bytes;
}

function permute(input: number[], table: number[]): number[] {
	return table.map((t) => input[t - 1]);
}

function leftRotate(arr: number[], n: number): number[] {
	return arr.slice(n).concat(arr.slice(0, n));
}

function generateSubkeys(keyBytes: Uint8Array): number[][] {
	// keyBytes is 8 bytes (64 bits) for DES; parity bits ignored here.
	const keyBits = bytesToBits(keyBytes);
	const permuted = permute(keyBits, PC1); // 56 bits
	let c = permuted.slice(0, 28);
	let d = permuted.slice(28, 56);
	const subkeys: number[][] = [];
	for (let i = 0; i < 16; i++) {
		c = leftRotate(c, SHIFTS[i]);
		d = leftRotate(d, SHIFTS[i]);
		const cd = c.concat(d);
		subkeys.push(permute(cd, PC2)); // 48 bits
	}
	return subkeys;
}

function sboxSubstitution(input48: number[]): number[] {
	const output32: number[] = [];
	for (let i = 0; i < 8; i++) {
		const chunk = input48.slice(i * 6, i * 6 + 6);
		const row = (chunk[0] << 1) | chunk[5];
		let col = 0;
		for (let j = 1; j <= 4; j++) col = (col << 1) | chunk[j];
		const s = S_BOXES[i][row][col];
		for (let b = 3; b >= 0; b--) output32.push((s >> b) & 1);
	}
	return output32;
}

function feistel(r: number[], subkey: number[]): number[] {
	const expanded = permute(r, E); // 48
	const xored = expanded.map((bit, i) => bit ^ subkey[i]);
	const sboxed = sboxSubstitution(xored);
	return permute(sboxed, P); // 32
}

function desBlock(block: Uint8Array, subkeys: number[][], decrypt = false): Uint8Array {
	const bits = bytesToBits(block);
	const perm = permute(bits, IP);
	let l = perm.slice(0, 32);
	let r = perm.slice(32, 64);
	for (let i = 0; i < 16; i++) {
		const k = decrypt ? subkeys[15 - i] : subkeys[i];
		const f = feistel(r, k);
		const newL = r;
		const newR = l.map((v, idx) => v ^ f[idx]);
		l = newL;
		r = newR;
	}
	const preoutput = r.concat(l);
	const finalBits = permute(preoutput, FP);
	return bitsToBytes(finalBits);
}

function makeDESSubkeysFromKeyBytes(keyBytes: Uint8Array): number[][] {
	// keyBytes length must be 8
	return generateSubkeys(keyBytes);
}

function xorBlocks(a: Uint8Array, b: Uint8Array): Uint8Array {
	const out = new Uint8Array(a.length);
	for (let i = 0; i < a.length; i++) out[i] = a[i] ^ b[i];
	return out;
}

function pkcs7Pad(data: Uint8Array, blockSize = 8): Uint8Array {
	const padLen = blockSize - (data.length % blockSize || blockSize);
	const out = new Uint8Array(data.length + padLen);
	out.set(data, 0);
	out.fill(padLen, data.length);
	return out;
}

function splitKey(key: Uint8Array): [Uint8Array, Uint8Array, Uint8Array] {
	if (key.length === 16) {
		// 2-key 3DES: K1 K2 K1
		return [key.slice(0, 8), key.slice(8, 16), key.slice(0, 8)];
	} else if (key.length === 24) {
		return [key.slice(0, 8), key.slice(8, 16), key.slice(16, 24)];
	} else {
		throw new Error("Key must be 16 or 24 bytes for 3DES");
	}
}

export function encrypt3DESCBC(plaintext: Uint8Array, key: Uint8Array): Uint8Array {
	const padded = pkcs7Pad(plaintext, 8);
	const [k1, k2, k3] = splitKey(key);
	const s1 = makeDESSubkeysFromKeyBytes(k1);
	const s2 = makeDESSubkeysFromKeyBytes(k2);
	const s3 = makeDESSubkeysFromKeyBytes(k3);
	const out = new Uint8Array(padded.length);
	let prev: Uint8Array<ArrayBufferLike> = new Uint8Array(8); // IV of all zeros
	for (let offset = 0; offset < padded.length; offset += 8) {
		const block = padded.slice(offset, offset + 8);
		const x = xorBlocks(block, prev);
		const e1 = desBlock(x, s1, false);
		const d2 = desBlock(e1, s2, true);
		const e3 = desBlock(d2, s3, false);
		out.set(e3, offset);
		prev = e3;
	}
	return out;
}

export function decrypt3DESCBC(ciphertext: Uint8Array, key: Uint8Array): Uint8Array {
	if (ciphertext.length % 8 !== 0) throw new Error("Ciphertext length must be multiple of 8");
	const [k1, k2, k3] = splitKey(key);
	const s1 = makeDESSubkeysFromKeyBytes(k1);
	const s2 = makeDESSubkeysFromKeyBytes(k2);
	const s3 = makeDESSubkeysFromKeyBytes(k3);
	const out = new Uint8Array(ciphertext.length);
	let prev = new Uint8Array(8); // IV of all zeros
	for (let offset = 0; offset < ciphertext.length; offset += 8) {
		const block = ciphertext.slice(offset, offset + 8);
		const d3 = desBlock(block, s3, true);
		const e2 = desBlock(d3, s2, false);
		const d1 = desBlock(e2, s1, true);
		const plain = xorBlocks(d1, prev);
		out.set(plain, offset);
		prev = block;
	}
	return out;
}