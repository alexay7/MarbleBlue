import * as zlib from "node:zlib";

function urlToMap(url: string): Record<string, string> {
	return url.split("&").map(param => param.split("=")).filter(param => param.length === 2).reduce((map, param) => {
		const [first, second] = param as [string, string];
		map[first] = second;
		return map;
	}, {} as Record<string, string>);
}

export function toUrl(map: Record<string, unknown>): string {
	return Object.entries(map).map(([key, value]) => `${key}=${value}`).join("&");
}

function decodeBytes({data, base64, nowrap}:{data:Buffer, base64:boolean, nowrap:boolean}):Record<string, string> {
	const bytes = base64 ? Buffer.from(data.toString("base64")
		, "base64") : data;

	const decompressed = nowrap ? zlib.inflateRawSync(bytes).toString() : zlib.inflateSync(bytes).toString();

	return urlToMap(decompressed);
}

export function decodeAllNet(data: Buffer): Record<string, string> {
	return decodeBytes({data, base64:true, nowrap:false});
}