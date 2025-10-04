import {Router} from "express";
import {userService} from "../services/user.service.ts";
import {customValidateRequest} from "../helpers/zod.ts";
import z from "zod";

const userRouter = Router({mergeParams:true});

userRouter.get("/cards",
	userService.getUserCards
);

userRouter.post("/cards",
	customValidateRequest({
		body:z.strictObject({
			accessCode: z.string()
		})
	}),
	userService.registerCard
);

export default userRouter;