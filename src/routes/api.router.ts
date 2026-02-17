// /api"
import {Router} from "express";
import {protectedRoute} from "../middleware/protected.ts";
import userRouter from "./user.router.ts";
import {customValidateRequest} from "../utils/zod.ts";
import z from "zod";
import gamesRouter from "./api/games.router.ts";
import {Card} from "../games/common/models/card.model.ts";

const apiRouter = Router({mergeParams:true});

apiRouter.use("/user", protectedRoute, userRouter);

apiRouter.use("/game/:card/",
	protectedRoute,
	customValidateRequest({
		params:z.strictObject({
			card: z.string()
		})
	}),
	async (req, res, next) => {
		const foundCard = await Card.findOne({extId:req.params.card, userId:req.currentUser!.id});

		if (!foundCard) {
			return res.status(404).json({message: "card-not-found"});
		}

		// Attach the found card to the request object for further use
		req.cardId = foundCard.profileId;

		next();
	},
	gamesRouter
);

apiRouter.use("/ping", protectedRoute, (req, res) => {
	res.json({message: "pong"});
});

export default apiRouter;