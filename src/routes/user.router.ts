import {Router} from "express";
import {userService} from "../services/user.service.ts";
import {customValidateRequest} from "../utils/zod.ts";
import z from "zod";

const userRouter = Router({mergeParams:true});

userRouter.get("/keychips",
	userService.getUserKeychips
);

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

userRouter.post("/verify",
	async (req, res)=> {
		await userService.verifyUser(req.currentUser!.id);
		res.json({message:"success"});
	}
);

export default userRouter;