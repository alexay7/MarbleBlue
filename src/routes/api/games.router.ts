import {Router} from "express";
import gekiApiRouter from "./geki.router.ts";
import chuniApiRouter from "./chuni.router.ts";
import maiApiRouter from "./mai.router.ts";
import sdvxApiRouter from "./sdvx.router.ts";

const gamesRouter = Router({mergeParams:true});

gamesRouter.use("/geki", gekiApiRouter);
gamesRouter.use("/chu3", chuniApiRouter);
gamesRouter.use("/mai2", maiApiRouter);
gamesRouter.use("/sdvx", sdvxApiRouter);

export default gamesRouter;