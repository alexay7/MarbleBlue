import type {Request, Response} from "express";
import {Card} from "../games/common/models/card.model.ts";
import {Types} from "mongoose";

export const userService = {
	getUserCards: async ( req: Request, res: Response) => {
		const foundCards = await Card.aggregate()
			.match({userId:new Types.ObjectId(req.currentUser!._id)})
			.lookup({
				from: "chu3userdatas",
				localField: "extId",
				foreignField: "cardId",
				as: "chuni"
			})
			.lookup({
				from: "gekiuserdatas",
				localField: "extId",
				foreignField: "userId",
				as: "geki"
			})
			.lookup({
				from: "mai2userdatas",
				localField: "extId",
				foreignField: "userId",
				as: "mai2"
			})
			.addFields({
				hasPlayedChuni: { $gt: [ { $size: "$chuni" }, 0 ] },
				hasPlayedGeki: { $gt: [ { $size: "$geki" }, 0 ] },
				hasPlayedMai2: { $gt: [ { $size: "$mai2" }, 0 ] }
			})
			.project({
				chuni:0,
				geki:0,
				mai:0
			});

		return res.json(foundCards);
	},
	registerCard: async ( req: Request, res: Response) => {
		const {accessCode} = req.body;

		const foundCard = await Card.findOne({accessCode});

		if (!foundCard) {
			return res.status(404).json({message: "card-not-found"});
		}

		if (foundCard.userId) {
			return res.status(400).json({message: "card-already-registered"});
		}

		const updatedCard = await Card.findByIdAndUpdate(foundCard._id, {userId: req.currentUser!._id}, {new: true});

		return res.json(updatedCard);
	}
};