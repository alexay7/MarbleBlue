import { betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import {db} from "../modules/mongoose.ts";
import {username, admin} from "better-auth/plugins";

export const auth = betterAuth({
	database: mongodbAdapter(db.getClient().db("MarbleBlue")),
	emailAndPassword:{
		enabled:true
	},
	plugins:[
		username(),
		admin()
	]
});