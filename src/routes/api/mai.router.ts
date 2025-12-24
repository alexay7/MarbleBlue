import {type Request, Router} from "express";
import {Mai2UserDataModel} from "../../games/mai2/models/userdata.model.ts";
import {Mai2GameTrophy} from "../../games/mai2/models/gametrophy.model.ts";
import {Mai2UserRatingModel} from "../../games/mai2/models/userrating.model.ts";
import {Mai2UserMusicDetailModel} from "../../games/mai2/models/usermusicdetail.model.ts";
import {Mai2GameMusic} from "../../games/mai2/models/gamemusic.model.ts";
import {Mai2UserLoginBonusModel} from "../../games/mai2/models/userloginbonus.model.ts";
import {Mai2GameLoginBonus} from "../../games/mai2/models/gameloginbonus.model.ts";
import {Mai2UserRegionModel} from "../../games/mai2/models/userregion.model.ts";
import {Mai2UserPlaylogModel} from "../../games/mai2/models/userplaylog.model.ts";
import {customValidateRequest} from "../../utils/zod.ts";
import z from "zod";
import {Mai2UserItemModel} from "../../games/mai2/models/useritem.model.ts";
import {Mai2UserFavoriteModel} from "../../games/mai2/models/userfavorite.model.ts";
import {Mai2UserCharacterModel} from "../../games/mai2/models/usercharacter.model.ts";
import {Mai2UserActivityModel} from "../../games/mai2/models/useractivity.model.ts";
import {Mai2GameShopItem} from "../../games/mai2/models/gameshopitem.model.ts";
import {Mai2UserOptionModel} from "../../games/mai2/models/useroption.model.ts";
import {UpdateMaiUserDataDto, UpdateMaiUserOptionsDto} from "../../dto/mai.dto.ts";
import {Types} from "mongoose";

const maiApiRouter = Router({mergeParams: true});

maiApiRouter.get("/userdata", async (req: Request, res) => {
	const foundUserData = await Mai2UserDataModel.findOne({userId: req.cardId}).sort({version: -1});

	res.json(foundUserData);
});

maiApiRouter.get("/userrating", async (req: Request, res) => {
	const foundUserRating = await Mai2UserRatingModel.findOne({userId: req.cardId});

	res.json(foundUserRating);
});

maiApiRouter.get("/trophies", async (req: Request, res) => {
	const tickets = await Mai2GameTrophy.find().sort({id: 1});

	res.json(tickets);
});

maiApiRouter.get("/music", async (req: Request, res) => {
	const gameMusic = await Mai2GameMusic.find().sort({id: 1});

	res.json(gameMusic);
});

maiApiRouter.get("/musicdetails", async (req: Request, res) => {
	const foundMusicDetails = await Mai2UserMusicDetailModel.aggregate()
		.match({userId: req.cardId})
		.lookup({
			from: "mai2userplaylogs",
			let: {musicId: "$musicId", level: "$level"},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{$eq: ["$musicId", "$$musicId"]},
								{$eq: ["$level", "$$level"]}
							]
						}
					}
				}, {
					$project: {totalCombo: 1, userPlayDate: 1}
				},

				{
					$sort: {achievement: -1}
				},
				{$limit: 1}
			],
			as: "bp"
		})
		.unwind({path: "$bp", preserveNullAndEmptyArrays: true});

	res.json(foundMusicDetails);
});

maiApiRouter.get("/loginbonus", async (req: Request, res) => {
	const loginBonuses = await Mai2GameLoginBonus.find().sort({id: 1});

	res.json(loginBonuses);
});

maiApiRouter.get("/userloginbonus", async (req: Request, res) => {
	const foundLoginBonuses = await Mai2UserLoginBonusModel.find({userId: req.cardId}).sort({isCurrent: -1});

	res.json(foundLoginBonuses);
});

maiApiRouter.get("/regions", async (req: Request, res) => {
	const userRegions = await Mai2UserRegionModel.find({userId: req.cardId});

	res.json(userRegions);
});

maiApiRouter.get("/playlog", async (req: Request, res) => {
	const userPlaylogs = await Mai2UserPlaylogModel.find({userId: req.cardId}).sort({userPlayDate: -1}).limit(50);

	res.json(userPlaylogs);
});

maiApiRouter.get("/playlog/:playlogId",
	customValidateRequest({
		params: z.object({
			playlogId: z.string().min(1)
		})
	}),
	async (req, res) => {
		const {playlogId} = req.params;

		const foundPlaylog = await Mai2UserPlaylogModel.findById(playlogId);

		res.json(foundPlaylog);
	}
);

maiApiRouter.get("/useritems", async (req: Request, res) => {
	const userItems = await Mai2UserItemModel.find({userId: req.cardId});

	res.json(userItems);
});

maiApiRouter.get("/userfavs", async (req: Request, res) => {
	const userFavs = await Mai2UserFavoriteModel.find({userId: req.cardId});

	res.json(userFavs);
});

maiApiRouter.get("/usercharacters", async (req: Request, res) => {
	const userCharacters = await Mai2UserCharacterModel.find({userId: req.cardId});

	res.json(userCharacters);
});

maiApiRouter.get("/ranking", async (req: Request, res) => {
	const topPlayers = await Mai2UserDataModel.aggregate()
		.group({_id: "$userId", rating: {$max: "$playerRating"}, userName: {$first: "$userName"}})
		.sort({playerRating: -1})
		.limit(25)
		.project({userName: 1, playerRating: "$rating", _id: 0});

	res.json(topPlayers);
});

maiApiRouter.get("/useractivity", async (req: Request, res) => {
	const userActivity = await Mai2UserActivityModel.findOne({userId: req.cardId});

	res.json(userActivity);
});

maiApiRouter.get("/shopitems", async (req: Request, res) => {
	const shopItems = await Mai2GameShopItem.find().sort({id: 1});

	res.json(shopItems);
});

maiApiRouter.get("/useroptions", async (req: Request, res) => {
	const userOptions = await Mai2UserOptionModel.findOne({userId: req.cardId});

	res.json(userOptions);
});

maiApiRouter.patch("/options",
	customValidateRequest({
		body: UpdateMaiUserOptionsDto
	}),
	async (req:Request, res) => {
		const updatedOptions = await Mai2UserOptionModel.findOneAndUpdate(
			{userId:req.cardId},
			{$set: req.body},
			{new: true, upsert: true}
		);

		res.json(updatedOptions);
	}
);

maiApiRouter.patch("/userdata",
	customValidateRequest({
		body:UpdateMaiUserDataDto
	}),
	async (req:Request, res) => {
		const updatedUserData = await Mai2UserDataModel.findOneAndUpdate(
			{userId:req.cardId, version:req.body.version},
			{$set: req.body},
			{new: true, upsert: true}
		);

		res.json(updatedUserData);
	}
);

maiApiRouter.post("/shop/purchase/:articleId",
	customValidateRequest({
		params: z.object({
			articleId: z.string().transform((val) => Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : null).refine((val) => val !== null, {message: "Invalid article ID"})
		}),
		body: z.object({
			version: z.number().optional()
		})
	}),
	async (req, res) => {
		const maiAccount = await Mai2UserDataModel.findOne({userId: req.cardId, version: req.body.version});
		if (!maiAccount) {
			return res.status(403).json({message: "general/not_played_yet"});
		}

		const shopItem = await Mai2GameShopItem.findById(req.params.articleId);

		if (!shopItem) {
			return res.status(404).json({message: "shop/item_not_found" });
		}

		if (maiAccount.point < shopItem.price) {
			return res.status(400).json({message: "shop/not_enough_point" });
		}

		let itemType = 0;

		if(shopItem.itemType==="チケット") itemType = 12;
		else if(shopItem.itemType==="パートナー") itemType = 10;
		else if(shopItem.itemType==="つあーメンバー") itemType = 9;
		else if(shopItem.itemType==="ネームプレート") itemType = 1;
		else if(shopItem.itemType==="フレーム") itemType = 11;
		else if(shopItem.itemType==="プレゼント") itemType = 14;

		// Add item to user inventory
		await Mai2UserItemModel.updateOne(
			{userId: req.cardId, itemId: shopItem.itemId, itemKind: itemType},
			{$inc: {stock: shopItem.quantity||1}},
			{upsert: true}
		);

		// Deduct points
		await Mai2UserDataModel.updateOne({userId: req.cardId, version: maiAccount.version}, {$inc: {point: -shopItem.price}});

		res.json({message: "success"});
	});

maiApiRouter.patch("/useritems/favorites/:itemKind",
	customValidateRequest({
		params: z.object({
			itemKind: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val >= 0, {message: "Invalid item kind"})
		}),
		body: z.object({
			itemidList: z.array(z.number().int().min(0))
		})
	}),
	async (req, res) => {
		const {itemKind} = req.params;
		const {itemidList} = req.body;

		await Mai2UserFavoriteModel.findOneAndReplace({userId: req.cardId, itemKind}, {
			userId: req.cardId,
			itemKind,
			itemidList
		}, {upsert: true});

		res.json({message: "success"});
	}
);

export default maiApiRouter;