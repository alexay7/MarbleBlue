// /api/auth"
import {Router} from "express";

const authRouter = Router({mergeParams:true});

authRouter.get("/ping", async (req, res) => {
	res.json({message: "pong"});
});

export default authRouter;