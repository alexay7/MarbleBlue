import {Router} from "express";
import gekiApiRouter from "./geki.router.ts";
import chuniApiRouter from "./chuni.router.ts";

const gamesRouter = Router({mergeParams:true});

gamesRouter.use("/geki", gekiApiRouter);
gamesRouter.use("/chu3", chuniApiRouter);

export default gamesRouter;