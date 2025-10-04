import {customValidateRequest} from "../helpers/zod.ts";
import {Router} from "express";
import z from "zod";
import DiscordService from "../services/discord.service.ts";

const authRouter = Router({mergeParams:true});

authRouter.use("/oauth",
	customValidateRequest({
		body:z.strictObject({
			code: z.string()
		})
	}),
	DiscordService.getAuthToken
);

authRouter.use("/token",
	DiscordService.getAccessToken
);

export default authRouter;