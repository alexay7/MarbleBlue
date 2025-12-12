import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {type RequestHandler, Router, type Request} from "express";
import {Chu3UserData} from "../games/chu3/models/userdata.model.ts";
import {Chu3GameGacha} from "../games/chu3/models/gamegacha.model.ts";
import {Chu3UserCharacter} from "../games/chu3/models/usercharacter.model.ts";
import {Chu3UserItem} from "../games/chu3/models/useritem.model.ts";
import {Chu3UserGacha} from "../games/chu3/models/usergacha.model.ts";
import type {Chu3GameGachaCardType} from "../games/chu3/types/gamegacha.types.ts";
import type {Chu3UserItemType} from "../games/chu3/types/useritem.types.ts";
import {deleteRedisKey} from "../modules/redis.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/cmchu3/:ver/"
const chu3CMRouter = Router({mergeParams:true});

chu3CMRouter.post("/CMGetUserPreviewApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userData = await Chu3UserData.findOne({cardId: req.body.userId}, {userName:1, level:1, medal:1, lastDataVersion:1}).lean();

	if(!userData) return res.json({});

	res.json({
		...userData,
		isLogin:false
	});
});

chu3CMRouter.post("/CMGetUserDataApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userData = await Chu3UserData.findOne({cardId: req.body.userId}).lean();

	if(!userData) return res.json({});

	res.json({
		userId:req.body.userId,
		userData:{
			...userData,
			lastPlayDate: dayjs(userData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
			eventWatchedDate: dayjs(userData.eventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0"),
			firstPlayDate: dayjs(userData.firstPlayDate).format("YYYY-MM-DD HH:mm:ss.0")
		},
		userEmoney: {
			type:0,
			emoneyCredit: 777,
			emoneyBrand: 2,
			ext1:0,
			ext2:0,
			ext3:0
		}
	});
});

chu3CMRouter.post("/GetGameGachaApi", async (_:Request, res) => {
	const gachas = await Chu3GameGacha.find({}, {cards:0, _id:0}).lean();

	res.json({
		"length": gachas.length,
		"gameGachaList":gachas,
		"registIdList":[]
	});
});

chu3CMRouter.post("/GetGameGachaCardByIdApi", async (req:Request, res) => {
	if(!req.body.gachaId) return res.json({});

	const gacha = await Chu3GameGacha.findOne({gachaId: req.body.gachaId}).lean();

	if(!gacha) return res.json({});

	res.json({
		"gachaId": gacha.gachaId,
		"length": gacha.cards.length,
		"isPickup": gacha.cards.some(c=>c.isPickup),
		"gameGachaCardList": gacha.cards,
		"emissionList":[],
		"afterCalcList":[]
	});
});

chu3CMRouter.post("/CMGetUserCharacterApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	let nextIndex = parseInt(req.body.nextIndex) || 0;
	const limit = parseInt(req.body.maxCount) || 300;

	const userCharacters = await Chu3UserCharacter.find({cardId: req.body.userId}, {_id:0, cardId:0, __v:0}).skip(nextIndex).limit(limit+1).lean();

	if (!userCharacters) return res.json({
		userId:req.body.userId,
		length:0,
		nextIndex:-1,
		userCharacterList:[]
	});

	nextIndex = userCharacters.length > limit ? nextIndex + limit : -1;

	res.json({
		userId:req.body.userId,
		length:userCharacters.length,
		nextIndex:nextIndex,
		userCharacterList:userCharacters
	});
});

chu3CMRouter.post("/CMGetUserItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const limit = parseInt(req.body.maxCount) || 300;
	const kind = Math.floor(req.body.nextIndex / 10000000000);
	let nextIndex = parseInt(req.body.nextIndex) % 10000000000 || 0;

	const userItems = await Chu3UserItem.find({cardId: req.body.userId, itemKind: kind}, {_id:0, cardId:0, __v:0}).skip(nextIndex).limit(limit+1).lean();

	if (!userItems) return res.json({
		userId:req.body.userId,
		length:0,
		nextIndex:-1,
		userItemList:[]
	});

	nextIndex = userItems.length > limit ? kind * 10000000000 + (nextIndex + limit)
		: -1;

	res.json({
		userId:req.body.userId,
		length:userItems.length,
		itemKind:kind,
		nextIndex:nextIndex,
		userItemList:userItems
	});
});


chu3CMRouter.post("/GetUserGachaApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userGacha = await Chu3UserGacha.find({cardId: req.body.userId}).lean();

	res.json({
		length: userGacha.length,
		userGachaList: userGacha
	});
});

chu3CMRouter.post("/CMUpsertUserGachaApi", async (req:Request, res) => {
	if(!req.body.userId || !req.body.cmUpsertUserGacha) return res.json({
		"returnCode":1,
	});

	const {cmUpsertUserGacha, gachaId}=req.body;

	if (cmUpsertUserGacha.userItemList && cmUpsertUserGacha.userItemList.length > 0) {
		// clear useritems cache
		deleteRedisKey("GetUserItemApi", req.body.userId);

		await Chu3UserItem.bulkWrite(
			cmUpsertUserGacha.userItemList.map((item: Chu3UserItemType) => ({
				updateOne: {
					filter: {cardId: req.body.userId, itemId: item.itemId},
					update: {$set: {...item, cardId: req.body.userId}},
					upsert: true
				}
			}))
		);
	}

	if (cmUpsertUserGacha.userGacha) {
		// clear useritems cache
		deleteRedisKey("GetUserGachaApi", req.body.userId);

		await Chu3UserGacha.findOneAndUpdate(
			{cardId: req.body.userId, gachaId: gachaId},
			{$set: cmUpsertUserGacha.userGacha},
			{upsert: true}
		);
	}

	res.json({
		returnCode:1,
		apiName:"CMUpsertUserGachaApi",
		userCardPrintStateList: cmUpsertUserGacha.gameGachaCardList.map((c:Chu3GameGachaCardType, i:number)=>({
			orderId:i,
			hasCompleted:true,
			limiteDate: dayjs("2099-12-31 23:59:59").format("YYYY-MM-DD HH:mm:ss.0"),
			placeId:291,
			cardId:c.cardId,
			gachaId:c.gachaId,
			userId:req.body.userId,
		}))
	});
});

chu3CMRouter.post("/RollGachaApi", async (req:Request, res) => {
	if(!req.body.userId || !req.body.gachaId || !req.body.times) return res.json({});

	let cards:Chu3GameGachaCardType[];

	if(req.body.characterId) {
		cards = await Chu3GameGacha.aggregate([
			{$match: {gachaId: req.body.gachaId, "cards.characterId": req.body.characterId}},
			{$unwind: "$cards"},
			{$match: {"cards.characterId": req.body.characterId}},
			{$replaceRoot: {newRoot: "$cards"}},
			{$sample: {size: req.body.times}}
		]);
	}else {
		cards = await Chu3GameGacha.aggregate([
			{$match: {gachaId: req.body.gachaId}},
			{$unwind: "$cards"},
			{$replaceRoot: {newRoot: "$cards"}},
			{$sample: {size: req.body.times}}
		]);
	}

	if(cards.length === 0) return res.json({});

	res.json({
		length: cards.length,
		gameGachaCardList: cards
	});
});

chu3CMRouter.post("/GetUserCardPrintErrorApi", (_:Request, res) => {
	res.json({
		"returnCode":1,
		"errorList":[]
	});
});

chu3CMRouter.post("/GetUserPrintedCardApi", (_:Request, res) => {
	res.json({
		"returnCode":1,
		"printedCardList":[]
	});
});


const noOpFunction:RequestHandler = (req, res)=> {
	const response = {
		"returnCode":1,
		"orderId":0,
		"serialId":"FAKECARDIMAG12345678",
		"apiName": req.path.split("/").pop() || "",
	};

	res.json(response);
};

const noOpEndpoints = [
	"PrinterLoginApi",
	"PrinterLogoutApi",
	"CMUpsertUserPrintApi",
	"CMUpsertUserPrintlogApi",
	"CMUpsertUserPrintCancelApi",
	"CMUpsertUserPrintSubtractApi",
	"Ping"
].map(ep=>"/" + ep);

chu3CMRouter.post(noOpEndpoints, noOpFunction);

export default chu3CMRouter;