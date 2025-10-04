import {Router} from "express";
import gekiApiRouter from "./geki.router.ts";

const gamesRouter = Router({mergeParams:true});

gamesRouter.use("/geki", gekiApiRouter);

export default gamesRouter;