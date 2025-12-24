import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {type Request, type RequestHandler, Router} from "express";
import {Mai2UserDataModel} from "../games/mai2/models/userdata.model.ts";
import {Mai2UserCharacterModel} from "../games/mai2/models/usercharacter.model.ts";
import {Mai2UserItemModel} from "../games/mai2/models/useritem.model.ts";
import {Mai2GameCardModel} from "../games/mai2/models/gamecards.model.ts";
import type {Mai2UserCardType} from "../games/mai2/types/usercard.types.ts";
import {Mai2UserCardModel} from "../games/mai2/models/usercard.model.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/cmmai2/:ver/"
const mai2CMRouter = Router({mergeParams:true});

mai2CMRouter.post("/CMGetUserPreviewApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userData = await Mai2UserDataModel.findOne({userId: req.body.userId}, {userName:1, rating:1, lastDataVersion:1}).lean();

	if(!userData) return res.json({});

	res.json({
		...userData,
		userId:req.body.userId,
		isLogin:false,
		isExistSellingCard:false
	});
});

mai2CMRouter.post("/CMGetUserCharacterApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const characters = await Mai2UserCharacterModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userCharacterList: characters
	});
});

mai2CMRouter.post("/CMGetSellingCardApi", async (_:Request, res) => {
	const gameCards = await Mai2GameCardModel.find({}).lean();

	res.json({
		length:gameCards.length,
		sellingCardList:gameCards.map(c=>({
			...c,
			startDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			endDate:dayjs("2099-01-01").format("YYYY-MM-DD HH:mm:ss"),
			noticeStartDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			noticeEndDate:dayjs("2099-01-01").format("YYYY-MM-DD HH:mm:ss")
		}))
	});
});

mai2CMRouter.post("/CMGetUserDataApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await Mai2UserDataModel.findOne({userId: req.body.userId, version:{$lte: version}}).sort({version:-1}).lean();

	if(!foundUserData) return res.json({});

	res.json({
		userId: req.body.userId,
		userData: foundUserData
	});
});

mai2CMRouter.post("/CMGetUserItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = Math.floor(req.body.nextIndex / 10000000000);

	const userItems = await Mai2UserItemModel.find({userId: req.body.userId}, {_id:0, userId:0, __v:0}).lean();

	if (!userItems) return res.json({
		userId:req.body.userId,
		length:0,
		nextIndex:-1,
		userItemList:[]
	});

	res.json({
		userId:req.body.userId,
		itemKind:kind,
		nextIndex:0,
		userItemList:userItems
	});
});

mai2CMRouter.post("/CMGetUserCardApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const userCards = await Mai2UserCardModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userCards.length,
		userCardList: userCards
	});
});

mai2CMRouter.post("/CMUpsertUserPrintApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const printedCard = req.body.userPrintDetail.userCard as Mai2UserCardType;

	if(!printedCard) return res.json({});

	await Mai2UserCardModel.create({
		...printedCard,
		userId:req.body.userId,
	});

	res.json({
		returnCode:1,
		apiName:"CMUpsertUserPrintApi"
	});
});

const noOpFunction:RequestHandler = (req, res)=> {
	res.json({
		"returnCode":1,
		"apiName": req.path.split("/").pop() || "",
	});
};

// Endpoints without any operation, just return 200 OK with minimal data
const noOpEndpoints = [
	"Ping",
	"CMUpsertUserPrintlogApi",
	"CMLoginApi",
	"CMLogoutApi",
	"CMUpsertBuyCardApi",
	"CMGetUserCardPrintErrorApi"
].map(ep=>"/" + ep);

mai2CMRouter.post(noOpEndpoints, noOpFunction);

export default mai2CMRouter;