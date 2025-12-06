import type {Request, Response} from "express";
import {Card} from "../games/common/models/card.model.ts";
import {Types} from "mongoose";
import {db} from "../modules/mongoose.ts";

export const userService = {
	getUserData: async ( req: Request, res: Response) => {
		return res.json(req.currentUser);
	},
	getUserCards: async ( req: Request, res: Response) => {
		const foundCards = await Card.aggregate()
			.match({userId:new Types.ObjectId(req.currentUser!.id)})
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

		const updatedCard = await Card.findByIdAndUpdate(foundCard._id, {userId: req.currentUser!.id}, {new: true});

		return res.json(updatedCard);
	},
	verifyUser: async ( req: Request, res: Response) => {
		await db.db?.collection("user")?.updateOne({_id:new Types.ObjectId(req.currentUser?.id)}, {$set:{emailVerified: true, updatedAt: new Date()}});

		return res.json({message:"success"});
	}
};