import type {Request, Response} from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import qs from "querystring";
import {config} from "../config/config.ts";
import {User} from "../games/common/models/user.model.ts";

const discordService = {
	getAuthToken: async (req: Request, res: Response) => {
		const data = qs.stringify({
			client_id: config.DISCORD_CLIENT_ID as string,
			client_secret: config.DISCORD_CLIENT_SECRET as string,
			grant_type: "authorization_code",
			code: req.body.code,
			redirect_uri: config.WEBUI_URL as string + "/login",
			scope: "identify",
		});

		const tokenResponseData = await axios.request({
			url: "https://discord.com/api/oauth2/token",
			method: "POST",
			data: data,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}).catch((err) => {
			console.error("Error fetching Discord token:", err.response?.data || err.message);
			return null;
		});

		if (!tokenResponseData) {
			return res.status(400).json({message: "Invalid token"});
		}

		const oauthData = await tokenResponseData.data;

		return res.json(oauthData);
	},
	getAccessToken: async ( req: Request, res: Response) => {
		const authString = req.headers.authorization;

		if (!authString) {
			return res.status(401).json({message: "Unauthorized"});
		}

		const me = await axios.get("https://discord.com/api/users/@me", {
			headers: {
				authorization: authString,
			},
		});

		if (me.status !== 200) {
			return false;
		}

		const response = await me.data;

		// Search user in DB and create if not exists
		let foundUser = await User.findOne({discordId: response.id}).lean();

		if (!foundUser) {
			foundUser = await User.create({
				discordId: response.id,
				username: response.username
			});
		}

		const accessToken = jwt.sign(foundUser, config.SESSION_SECRET as string, {
			expiresIn: "7d",
		});

		res.json({accessToken, userData:{discordId: response.id, username: response.username}});
	}
};

export default discordService;