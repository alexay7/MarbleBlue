import { betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import {db} from "../modules/mongoose.ts";
import {username, admin, captcha} from "better-auth/plugins";
import {userService} from "../services/user.service.ts";

export const auth = betterAuth({
	database: mongodbAdapter(db.getClient().db("MarbleBlue")),
	emailAndPassword:{
		enabled:true
	},
	emailVerification:{
		sendVerificationEmail: async ({user})=>{
			await userService.verifyUser(user.id);
		}
	},
	plugins:[
		username(),
		admin(),
		captcha({
			provider: "cloudflare-turnstile",
			secretKey: process.env.TURNSTILE_SECRET_KEY!,
		}),
	]
});