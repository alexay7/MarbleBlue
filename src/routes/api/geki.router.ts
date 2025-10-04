import {Router, type Request} from "express";
import {GekiUserData} from "../../games/geki/models/userdata.model.ts";
import {GekiGameTrophy} from "../../games/geki/models/gametrophy.model.ts";
import {GekiUserActivity} from "../../games/geki/models/useractivity.model.ts";
import {GekiGameMusic} from "../../games/geki/models/gamemusic.model.ts";
import {GekiUserMisc} from "../../games/geki/models/usermisc.model.ts";
import {GekiUserPlaylog} from "../../games/geki/models/userplaylog.model.ts";
import {Types} from "mongoose";
import {GekiUserMusicDetail} from "../../games/geki/models/usermusicdetail.model.ts";
import {GekiUserTechCount} from "../../games/geki/models/usertechcount.model.ts";
import {GekiUserRegion} from "../../games/geki/models/userregion.model.ts";
import {GekiGameEvent} from "../../games/geki/models/gameevent.model.ts";
import {GekiGameChapter} from "../../games/geki/models/gamechapter.model.ts";
import {GekiUserEventPoint} from "../../games/geki/models/usereventpoint.model.ts";
import {GekiUserItem} from "../../games/geki/models/useritem.model.ts";
import {GekiUserCard} from "../../games/geki/models/usercard.model.ts";
import {GekiGameCard} from "../../games/geki/models/gamecard.model.ts";
import {GekiUserCharacter} from "../../games/geki/models/usercharacter.model.ts";
import {GekiUserDeck} from "../../games/geki/models/userdeck.model.ts";
import {GekiUserGameOption} from "../../games/geki/models/usergameoption.model.ts";
import {customValidateRequest} from "../../helpers/zod.ts";
import {UpdateGekiUserDataDto, UpdateGekiUserOptionsDto, UpdateGekiUserRivalsDto} from "../../dto/geki.dto.ts";
import {GekiGameLoginBonus} from "../../games/geki/models/gameloginbonus.model.ts";
import {GekiUserLoginBonus} from "../../games/geki/models/userloginbonus.model.ts";

const gekiApiRouter = Router({mergeParams:true});

gekiApiRouter.get("/userdata", async (req:Request, res) => {
	const foundUserData = await GekiUserData.findOne({userId:req.cardId});

	res.json(foundUserData);
});

gekiApiRouter.get("/activity", async (req:Request, res) => {
	const activities = await GekiUserActivity.find({userId:req.cardId}).sort({sortNumber:-1});

	res.json(activities);
});

gekiApiRouter.get("/misc", async (req:Request, res) => {
	const foundUserData = await GekiUserMisc.findOne({userId:req.cardId});

	res.json(foundUserData);
});

gekiApiRouter.get("/playlog", async (req:Request, res) => {
	const playlogs = await GekiUserPlaylog.find({userId:req.cardId}).sort({userPlayDate:-1}).limit(req.query.limit ? parseInt(req.query.limit as string) : -1);

	res.json(playlogs);
});

gekiApiRouter.get("/playlog/:playlogId", async (req:Request, res) => {
	const playlog = await GekiUserPlaylog.findById(new Types.ObjectId(req.params.playlogId!));

	res.json(playlog);
});

gekiApiRouter.get("/musicDetails", async (req:Request, res) => {
	const musicDetails = await GekiUserMusicDetail.aggregate()
		.match({userId:req.cardId});

	res.json(musicDetails);
});

gekiApiRouter.get("/music/:musicId/bestbattle", async (req:Request, res) => {
	const musicDetail = await GekiUserPlaylog.findOne({
		userId:req.cardId,
		musicId:req.params.musicId
	}).sort({battleScore:-1});

	res.json(musicDetail);
});

gekiApiRouter.get("/techcount", async (req:Request, res) => {
	const techCounts = await GekiUserTechCount.find({userId:req.cardId});

	res.json(techCounts);
});

gekiApiRouter.get("/regions", async (req:Request, res) => {
	const regions = await GekiUserRegion.find({userId:req.cardId});

	res.json(regions);
});

gekiApiRouter.get("/events/:eventId", async (req:Request, res) => {
	const eventPoints = await GekiUserEventPoint.findOne({userId:req.cardId, eventId:req.params.eventId});

	res.json(eventPoints);
});

gekiApiRouter.get("/items", async (req:Request, res) => {
	const items = await GekiUserItem.find({userId:req.cardId}).sort({itemId:1});
	const cards = await GekiUserCard.find({userId:req.cardId}).sort({cardId:1});

	res.json({items, cards});
});

gekiApiRouter.get("/music/:songId", async (req:Request, res) => {
	const musicPlaylogs = await GekiUserPlaylog.find({userId:req.cardId, musicId:req.params.songId}).sort({userPlayDate:-1});

	res.json(musicPlaylogs);
});

gekiApiRouter.get("/characters", async (req:Request, res) => {
	const characters = await GekiUserCharacter.find({userId:req.cardId, characterId:{$lte:1016}});

	res.json(characters);
});

gekiApiRouter.get("/decks", async (req:Request, res) => {
	const decks = await GekiUserDeck.find({userId:req.cardId}).sort({deckNumber:1});

	res.json(decks);
});

gekiApiRouter.get("/options", async (req:Request, res) => {
	const options = await GekiUserGameOption.findOne({userId:req.cardId});

	res.json(options);
});

gekiApiRouter.get("/userloginbonus", async (req:Request, res) => {
	const loginBonuses = await GekiUserLoginBonus.find({userId:req.cardId}).sort({loginBonusId:1});

	res.json(loginBonuses);
});

gekiApiRouter.get("/rivals", async (req:Request, res) => {
	const userMisc = await GekiUserMisc.findOne({userId:req.cardId});

	if (!userMisc || !userMisc.rivalList) return res.json([]);

	res.json({rivals: userMisc.rivalList});
});


gekiApiRouter.get("/events", async (req:Request, res) => {
	const events = await GekiGameEvent.aggregate()
		.match({active:true, eventType:{$in:["RankingEvent", "TechChallengeEvent"]}})
		.group({
			_id: {
				chapterId:"$chapterId",
				chapterName:"$chapterName",
			},
			events: {
				$push: {
					eventType: "$eventType",
				}
			},
			firstEventId: {$first:"$eventId"},
		}).sort({firstEventId:-1});

	res.json(events);
});

gekiApiRouter.get("/chapters/items", async (req:Request, res) => {
	const events = await GekiGameChapter.aggregate()
		.unwind({path: "$shopItems"})
		.group({
			_id: {
				chapter: {
					id:"$chapterId",
					name:"$chapterName"
				},
				itemType: "$shopItems.itemType"
			},
			items: {
				$push: {
					itemId: "$shopItems.itemId",
					itemName: "$shopItems.itemName"
				}
			}
		})
		.group({
			_id: "$_id.chapter",
			itemsByType: {
				$push: {
					itemType: "$_id.itemType",
					items: "$items"
				}
			}
		});

	res.json(events);
});

gekiApiRouter.get("/chapters/:chapterId", async (req:Request, res) => {
	const event = await GekiGameChapter.aggregate()
		.match({chapterId:parseInt(req.params.chapterId!)})
		.lookup({
			from: "gekigameevents",
			localField: "chapterId",
			foreignField: "chapterId",
			as: "events",
		})
		.lookup({
			from: "gekiuserchapters",
			localField: "chapterId",
			foreignField: "chapterId",
			as: "userChapterData",
		})
		.unwind({
			path: "$userChapterData",
			preserveNullAndEmptyArrays: true,
		});

	if (event.length === 0) return res.status(404).json({message:"Chapter not found"});

	res.json(event[0]);
});

gekiApiRouter.get("/trophies", async (_, res) => {
	const trophies = await GekiGameTrophy.find().lean();

	res.json(trophies);
});

gekiApiRouter.get("/music", async (req, res) => {
	const music = await GekiGameMusic.find().lean();

	res.json(music);
});

gekiApiRouter.get("/cards", async (req, res) => {
	const cards = await GekiGameCard.find().sort({_id:1}).lean();

	res.json(cards);
});

gekiApiRouter.get("/loginbonus", async (req, res) => {
	const type = req.query.type === "special" ? {bonusId:{$ne:100}} : {bonusId:100};

	console.log(type);

	const loginBonuses = await GekiGameLoginBonus.find({enabled:true, ...type}).sort({loginBonusId:1}).lean();

	res.json(loginBonuses);
});

gekiApiRouter.patch("/options",
	customValidateRequest({
		body: UpdateGekiUserOptionsDto
	}),
	async (req:Request, res) => {
		const updatedOptions = await GekiUserGameOption.findOneAndUpdate(
			{userId:req.cardId},
			{$set: req.body},
			{new: true, upsert: true}
		);

		res.json(updatedOptions);
	}
);

gekiApiRouter.patch("/userdata",
	customValidateRequest({
		body:UpdateGekiUserDataDto
	}),
	async (req:Request, res) => {
		const updatedUserData = await GekiUserData.findOneAndUpdate(
			{userId:req.cardId},
			{$set: req.body},
			{new: true, upsert: true}
		);

		res.json(updatedUserData);
	}
);

gekiApiRouter.patch("/rivals",
	customValidateRequest({
		body: UpdateGekiUserRivalsDto
	}),
	async (req:Request, res) => {
		if (!req.body.rivals) return res.status(400).json({message:"No rivals provided"});

		const updatedUserMisc = await GekiUserMisc.findOneAndUpdate(
			{userId:req.cardId},
			{$set: {rivalList: req.body.rivals}},
			{new: true, upsert: true}
		);

		res.json(updatedUserMisc);
	}
);

export default gekiApiRouter;