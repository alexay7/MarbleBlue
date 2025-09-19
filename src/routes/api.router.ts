// /api"
import {Router} from "express";
import authRouter from "./apis/auth.router.ts";

const apiRouter = Router({mergeParams:true});

apiRouter.use("/auth", authRouter);

export default apiRouter;