import mongoose from "mongoose";
import {config} from "../config/config.ts";
import {log} from "../utils/general.ts";

export default function connectDB() {
	const url = config.MONGO_URI as string;

	try {
		void mongoose.connect(url,);
	} catch (err) {
		const error = err as Error;

		console.error(error.message);
		process.exit(1);
	}
	mongoose.connection.on("error", (err) => {
		log("mongo", `connection error: ${err}`);
	});
	return;
}

export const db = mongoose.createConnection(config.MONGO_URI!);

db.on("connected", function () {
	log("mongo", "Successfully connected to the database");
});