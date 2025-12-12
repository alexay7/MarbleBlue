import {config} from "../config/config.ts";
import {createClient} from "redis";
import {log} from "../utils/general.ts";

const redisClient = await createClient({
	url: config.REDIS_URL
})
	.on("error", (err) => console.log("Redis Client Error", err))
	.connect();

export function deleteRedisKey(endpoint:string, identifier?:string) {
	const pattern = `cache:chu3:*:${endpoint}*${identifier}*`;
	let cursor = "0";

	async function scanAndDelete() {
		const reply = await redisClient.scan(cursor, {
			MATCH: pattern,
			COUNT: 100
		});
		cursor = reply.cursor;
		const keys = reply.keys;

		if (keys.length > 0) {
			await redisClient.del(keys);
			log("redis", `Deleted keys: ${keys.join(", ")}`);
		}

		if (cursor !== "0") {
			await scanAndDelete();
		}
	}

	scanAndDelete().catch((err) => {
		console.error("Error scanning and deleting keys:", err);
	});
}

export {redisClient};