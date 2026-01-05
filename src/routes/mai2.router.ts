import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {type Request, type RequestHandler, Router} from "express";
import type {Mai2UserPlaylogType} from "../games/mai2/types/userplaylog.types.ts";
import {Mai2UserPlaylogModel} from "../games/mai2/models/userplaylog.model.ts";
import type {Mai2UpsertUserAllRequest} from "../games/mai2/types/userdata.types.ts";
import {Mai2UserExtendModel} from "../games/mai2/models/userextend.model.ts";
import {Mai2UserDataModel} from "../games/mai2/models/userdata.model.ts";
import {Mai2UserOptionModel} from "../games/mai2/models/useroption.model.ts";
import {Mai2UserRatingModel} from "../games/mai2/models/userrating.model.ts";
import {Mai2UserActivityModel} from "../games/mai2/models/useractivity.model.ts";
import {Mai2UserCharacterModel} from "../games/mai2/models/usercharacter.model.ts";
import {Mai2UserItemModel} from "../games/mai2/models/useritem.model.ts";
import {Mai2UserLoginBonusModel} from "../games/mai2/models/userloginbonus.model.ts";
import {Mai2UserMapModel} from "../games/mai2/models/usermap.model.ts";
import {Mai2UserMusicDetailModel} from "../games/mai2/models/usermusicdetail.model.ts";
import {Mai2UserCourseModel} from "../games/mai2/models/usercourse.model.ts";
import {Mai2UserFavoriteModel} from "../games/mai2/models/userfavorite.model.ts";
import {Mai2UserFriendSeasonRankingModel} from "../games/mai2/models/userfriendseasonranking.model.ts";
import {Mai2UserKaleidxScopeModel} from "../games/mai2/models/userkaleidxscope.model.ts";
import {Mai2UserIntimateModel} from "../games/mai2/models/userintimate.model.ts";
import type {Mai2UserMusicDetailType} from "../games/mai2/types/usermusicdetail.types.ts";
import {Mai2GameEventModel} from "../games/mai2/models/gameevent.model.ts";
import {Mai2GameChargeModel} from "../games/mai2/models/gamecharge.model.ts";
import {Mai2UserMissionModel} from "../games/mai2/models/usermission.model.ts";
import {Mai2UserCardModel} from "../games/mai2/models/usercard.model.ts";
import {Mai2UserRegionModel} from "../games/mai2/models/userregion.model.ts";
import {calculatePlayerNaiveRating, getThisWeeksCategoryRotation} from "../utils/mai.ts";
import type {Mai2GameEventType} from "../games/mai2/types/gameevent.types.ts";
import {Types} from "mongoose";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/mai2/:ver/"
const mai2Router = Router({mergeParams:true});

mai2Router.post("/Maimai2Servlet/GetGameSettingApi", (_:Request, res) => {
	const now = dayjs().tz("Asia/Tokyo");

	const jstRebootStatTime = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
	const jstRebootEndTime = now.subtract(7, "hour").format("YYYY-MM-DD HH:mm:ss");

	res.json({
		gameSetting:{
			isMaintenance:false,
			requestInterval:10,
			rebootStartTime:jstRebootStatTime,
			rebootEndTime: jstRebootEndTime,
			movieUploadLimit:100,
			movieStatus:1,
			movieServerUri: "",
			deliverServerUri:"",
			oldServerUri:"",
			usbDlServerUri:"",
			"rebootInterval": 0
		},
		isDumpUpload:false,
		isAou:false,
		isDevelop:false,
		isAouAccession:true
	});
});

mai2Router.post("/Maimai2Servlet/GetGameRankingApi", async (req, res) => {
	const popularSongsLast30Days = await Mai2UserPlaylogModel.aggregate<{_id:number, playCount:number}>()
		.match({
			playDate: {
				$gte: dayjs().subtract(30, "day").toDate()
			}
		})
		.group({
			_id: "$musicId",
			playCount: { $sum: 1 }
		})
		.sort({ playCount: -1 })
		.limit(49)
		.exec();

	res.json({
		type:req.body.type,
		gameRankingList:[
			{
				id: 11687,
				point:999,
				userName:""
			}
		].concat(popularSongsLast30Days.map(song => ({
			id: song._id,
			point: song.playCount,
			userName: ""
		})))
	});
});

mai2Router.post("/Maimai2Servlet/GetGameEventApi", async (req:Request, res) => {
	const events = await Mai2GameEventModel.find({enable:true}, {id:1, type:1}).lean() as Mai2GameEventType[];

	res.json({
		"type": req.body.type,
		"length": events.length,
		"gameEventList": events.map(e=>({
			...e,
			startDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			endDate:dayjs("2099-12-31").format("YYYY-MM-DD HH:mm:ss"),
			disableArea:""
		}))
			// Eventos semanales de INTL
			.concat([{
				_id: new Types.ObjectId(),
				id:BigInt(250724111),
				type:0,
				enable:true,
				startDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
				endDate:dayjs("2099-12-31").format("YYYY-MM-DD HH:mm:ss"),
				disableArea:""
			}])
	});
});

mai2Router.post("/Maimai2Servlet/GetGameFestaApi", async (req:Request, res) => {
	res.json({
		gameFestaData:{
			eventId:250926121,
			isRallyPeriod:true,
			isCircleJoinNotAllowed:false,
			jackingFestaSideId:1,
			festaSideDataList:[
				{
					festaSideId:1,
					rankInPlace:1,
					advantagePercent:50
				},
				{
					festaSideId:2,
					rankInPlace:2,
					advantagePercent:25
				},
				{
					festaSideId:3,
					rankInPlace:3,
					advantagePercent:25
				}
			]
		},
		gameResultFestaData:{
			eventId:251016121,
			resultFestaSideDataList:[{
				festaSideId:1,
				rank:1,
				advantagePercent:50
			},
			{
				festaSideId:2,
				rank:2,
				advantagePercent:25
			},
			{
				festaSideId:3,
				rank:3,
				advantagePercent:25
			}]
		}
	});
});

mai2Router.post("/Maimai2Servlet/GetPlaceCircleDataApi", async (req:Request, res) => {
	res.json({
		returnCode:1,
		circleId:1,
		aggrDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
	});
});

mai2Router.post("/Maimai2Servlet/GetGameTournamentInfoApi", (_:Request, res) => {
	res.json({
		"length": 1,
		"gameTournamentInfoList": [{
			tournamentId:1,
			tournamentName:"TOURNAMENT",
			rankingKind:0,
			scoreType:0,
			noticeStartDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			noticeEndDate:dayjs("2099-12-31").format("YYYY-MM-DD HH:mm:ss"),
			startDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			endDate:dayjs("2099-12-31").format("YYYY-MM-DD HH:mm:ss"),
			entryStartDate:dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss"),
			entryEndDate:dayjs("2099-12-31").format("YYYY-MM-DD HH:mm:ss"),
			gameTournamentMusicList:[
				{
					tournamentId:1,
					musicId:11687,
					level:3,
					isFirstLock:false
				}
			]
		}]
	});
});

mai2Router.post("/Maimai2Servlet/GetGameChargeApi", async (_:Request, res) => {
	const charge = await Mai2GameChargeModel.find({}, { _id: 0, __v: 0 }).lean();

	res.json({
		length: charge.length,
		gameChargeList:charge
	});
});

mai2Router.post("/Maimai2Servlet/GetGameMusicScoreApi", async (req:Request, res) => {
	res.json({
		gameMusicScore:{
			musicId:req.body.musicId,
			level:req.body.level,
			type:req.body.type,
			scoreData:""
		}
	});
});

mai2Router.post("/Maimai2Servlet/GetGameNgMusicIdApi", (_, res) => {
	res.json({
		length:0,
		musicIdList:[]
	});
});

mai2Router.post("/Maimai2Servlet/GetGameKaleidxScopeApi", (_, res) => {
	res.json({
		gameKaleidxScopeList: [
			{gateId: 1, phaseId: 5},
			{gateId: 2, phaseId: 5},
			{gateId: 3, phaseId: 5},
			{gateId: 4, phaseId: 5},
			{gateId: 5, phaseId: 5},
			{gateId: 6, phaseId: 5},
			{gateId: 7, phaseId: 5}
		]
	});
});

mai2Router.post("/Maimai2Servlet/GetUserPreviewApi", async (req, res) => {
	if(!req.body.userId||req.body.userId===4294967295) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await Mai2UserDataModel.findOne({userId: req.body.userId, version:{$lte: version}}, {
		userId:1,
		userName:1,
		lastGameId:1,
		lastDataVersion:1,
		lastRomVersion:1,
		lastLoginDate:1,
		lastPlayDate:1,
		playerRating:1,
		plateId:1,
		iconId:1,
		partnerId:1,
		frameId:1,
		totalAwake:1,
		isNetMember:1,
		dailyBonusDate:1,
		banState:1
	}).sort({version:-1}).lean();

	if(!foundUserData) return res.json({});

	const foundUserOptions = await Mai2UserOptionModel.findOne({userId: req.body.userId}, {
		headPhoneVolume:1,
		dispRate:1,
	}).lean();

	res.json({
		...foundUserData,
		...foundUserOptions,
		userId: req.body.userId,
		isLogin:false,
		isInherit:false,
		dailyBonusDate: foundUserData.dailyBonusDate ? dayjs(foundUserData.dailyBonusDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
		lastPlayDate: foundUserData.lastPlayDate ? dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
		lastLoginDate: foundUserData.lastLoginDate ? dayjs(foundUserData.lastLoginDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
	});
});

mai2Router.post("/Maimai2Servlet/UserLoginApi", (_, res) => {
	res.json({
		"returnCode": 1,
	});
});

mai2Router.post("/Maimai2Servlet/GetUserDataApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await Mai2UserDataModel.findOne({userId: req.body.userId, version:{$lte: version}}).sort({version:-1}).lean();

	if(!foundUserData) return res.json({});

	res.json({
		userId: req.body.userId,
		userData: {
			...foundUserData,
			eventWatchedDate: foundUserData.eventWatchedDate ? dayjs(foundUserData.eventWatchedDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			lastLoginDate: foundUserData.lastLoginDate ? dayjs(foundUserData.lastLoginDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			lastPlayDate: foundUserData.lastPlayDate ? dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			firstPlayDate: foundUserData.firstPlayDate ? dayjs(foundUserData.firstPlayDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			dailyBonusDate: foundUserData.dailyBonusDate ? dayjs(foundUserData.dailyBonusDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			dailyCourseBonusDate: foundUserData.dailyCourseBonusDate ? dayjs(foundUserData.dailyCourseBonusDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00",
			lastTrialPlayDate: foundUserData.lastTrialPlayDate ? dayjs(foundUserData.lastTrialPlayDate).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00"
		}
	});
});

mai2Router.post("/Maimai2Servlet/GetUserCardApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const userCards = await Mai2UserCardModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userCards.length,
		userCardList: userCards
	});
});

mai2Router.post("/Maimai2Servlet/GetUserCharacterApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const foundChars = await Mai2UserCharacterModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundChars.length,
		userCharacterList: foundChars
	});
});

mai2Router.post("/Maimai2Servlet/GetUserItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = Math.floor(req.body.nextIndex / 10000000000);

	const userItems = await Mai2UserItemModel.find({userId: req.body.userId, itemKind: kind}, {_id:0, userId:0, __v:0}).lean();

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

mai2Router.post("/Maimai2Servlet/GetUserCourseApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const foundCourses = await Mai2UserCourseModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		nextIndex:0,
		userCourseList: foundCourses
	});
});

mai2Router.post("/Maimai2Servlet/GetUserChargeApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 0,
		userChargeList: []
	});
});

mai2Router.post("/Maimai2Servlet/GetUserFavoriteApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const favId = req.body.itemKind;

	const foundFavs = await Mai2UserFavoriteModel.findOne({userId: req.body.userId, itemKind: favId}, {itemKind:1, itemIdList:1, _id:0}).lean();

	res.json({
		userId: req.body.userId,
		userFavorite: foundFavs
	});
});


mai2Router.post("/Maimai2Servlet/GetUserGhostApi", (req:Request, res) => {
	res.json({
		userId: req.body.userId,
		length: 0,
		userGhost: []
	});
});

mai2Router.post("/Maimai2Servlet/GetUserMapApi", async(req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundMaps = await Mai2UserMapModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundMaps.length,
		nextIndex: 0,
		userMapList: foundMaps
	});
});

mai2Router.post("/Maimai2Servlet/GetUserLoginBonusApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundBonuses = await Mai2UserLoginBonusModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundBonuses.length,
		nextIndex: 0,
		userLoginBonusList: foundBonuses
	});
});

mai2Router.post("/Maimai2Servlet/GetUserRegionApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundRegions = await Mai2UserRegionModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundRegions.length,
		userRegionList: foundRegions
	});
});

mai2Router.post("/Maimai2Servlet/GetUserRecommendRateMusicApi", async (req:Request, res) => {
	// TODO
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		userRecommendRateMusicIdList: []
	});
});

mai2Router.post("/Maimai2Servlet/GetUserRecommendSelectMusicApi", async (req:Request, res) => {
	// TODO
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		userRecommendSelectionMusicIdList: []
	});
});

mai2Router.post("/Maimai2Servlet/GetUserOptionApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundOptions = await Mai2UserOptionModel.findOne({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userOption: foundOptions
	});
});

mai2Router.post("/Maimai2Servlet/GetUserExtendApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundExtend = await Mai2UserExtendModel.findOne({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userExtend: foundExtend
	});
});

mai2Router.post("/Maimai2Servlet/GetUserRatingApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundRating = await Mai2UserRatingModel.findOne({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userRating: foundRating
	});
});

mai2Router.post("/Maimai2Servlet/GetUserMusicApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userMusicDetails = await Mai2UserMusicDetailModel.aggregate<{
        _id: number;
        musicDetails: Mai2UserMusicDetailType[];
    }>()
		.match({userId: req.body.userId.toString()})
		.group({
			_id: "$musicId",
			musicDetails: { $addToSet: "$$ROOT" }
		});

	const musicDetails = userMusicDetails.map(music => {
		return {
			length:music.musicDetails.length,
			userMusicDetailList:music.musicDetails
		};
	});

	res.json({
		userId:req.body.userId,
		length:musicDetails.length,
		nextIndex:0,
		userMusicList: musicDetails
	});
});

mai2Router.post("/Maimai2Servlet/GetUserPortraitApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 0,
		userPortraitList: []
	});
});

mai2Router.post("/Maimai2Servlet/GetUserActivityApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundActivity = await Mai2UserActivityModel.findOne({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userActivity: foundActivity
	});
});

mai2Router.post("/Maimai2Servlet/GetUserFriendSeasonRankingApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundRankings = await Mai2UserFriendSeasonRankingModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundRankings.length,
		nextIndex: 0,
		userFriendSeasonRankingList: foundRankings
	});
});

mai2Router.post("/Maimai2Servlet/GetUserFavoriteItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = req.body.kind;

	const foundFavs = await Mai2UserFavoriteModel.findOne({userId: req.body.userId, itemKind: kind}).lean();

	if (!foundFavs) return res.json({
		userId: req.body.userId,
		itemKind: kind,
		length: 0,
		nextIndex: -1,
		userFavoriteList: []
	});

	res.json({
		userId: req.body.userId,
		itemKind: kind,
		length: foundFavs.itemIdList.length,
		nextIndex: 0,
		userFavoriteList: foundFavs.itemIdList
	});
});

mai2Router.post("/Maimai2Servlet/GetGameWeeklyDataApi", (_, res) => {
	res.json({
		gameWeeklyData: {
			missionCategory: getThisWeeksCategoryRotation(),
			updateDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			beforeDate: "2077-01-01 00:00:00.0"
		}
	});
});

mai2Router.post("/Maimai2Servlet/GetUserMissionDataApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundMissions = await Mai2UserMissionModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userWeeklyData:{
			lastLoginWeek: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			beforeLoginWeek: dayjs().subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
			friendBonusFlag:false
		},
		userMissionDataList: foundMissions,
	});
});

mai2Router.post("/Maimai2Servlet/GetUserFriendBonusApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		returnCode:0,
		getMiles:0
	});
});

mai2Router.post("/Maimai2Servlet/GetUserIntimateApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundIntimates = await Mai2UserIntimateModel.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: foundIntimates.length,
		userIntimateList: foundIntimates
	});
});

mai2Router.post("/Maimai2Servlet/GetUserShopStockApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const items = req.body.shopItemIdList;

	res.json({
		userId: req.body.userId,
		userShopStockList: items.map((id:number) => ({
			shopItemId: id,
			tradeCount: 99
		}))
	});
});

mai2Router.post("/Maimai2Servlet/GetUserKaleidxScopeApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	let foundScopes = await Mai2UserKaleidxScopeModel.find({userId: req.body.userId}).lean();

	if (foundScopes.length<7){
		// All gates are unlocked by default since circles
		const gates = [1, 2, 3, 4, 5, 6, 7];
		const bulkOps = gates.filter(gateId => !foundScopes.find(scope => scope.gateId === gateId)).map(gateId => {
			return {
				insertOne: {
					document: {
						userId: req.body.userId,
						gateId,
						isGateFound:true,
						isKeyFound:true,
					}
				}
			};
		});

		if (bulkOps.length > 0) {
			await Mai2UserKaleidxScopeModel.bulkWrite(bulkOps);
		}
	}

	foundScopes = await Mai2UserKaleidxScopeModel.find({userId: req.body.userId}, {_id:0, userId:0}).lean();

	res.json({
		userId: req.body.userId,
		length:7,
		userKaleidxScopeList:foundScopes
	});
});

mai2Router.post("/Maimai2Servlet/GetUserCircleDataApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	// Circle Classes:
	// 0: White
	// 1: Green
	// 2: Yellow
	// 3: Red
	// 4: Violet
	// 5: Bronze
	// 6: Silver
	// 7: Gold
	// 8: Rainbow

	res.json({
		userId: req.body.userId,
		circleId: 1,
		circleName: "CHUNI HISPANOS",
		isPlace: false,
		circleClass: 7,
		lastLoginDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		circlePointRankingList:[{
			userId: req.body.userId,
			userName: "A",
			rank:1,
			point:Math.floor(Math.random()*10000),
		}]
	});
});

mai2Router.post("/Maimai2Servlet/GetUserCirclePointRankingApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	res.json({
		circleId: 1,
		circleName: "CHUNI HISPANOS",
	});
});

mai2Router.post("/Maimai2Servlet/GetUserCirclePointDataApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		aggDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		userCirclePointDataList:[{
			circleId: 1,
			userName: "A",
			aggDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			point: Math.floor(Math.random()*10000),
			recordDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			rewardGet:true
		}]
	});
});

mai2Router.post("/Maimai2Servlet/GetUserFestaApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	res.json({
		userFestaData:{
			eventId:250926121,
			circleId:1,
			festaSideId:1,
			circleTotalFestaPoint:Math.floor(Math.random()*50000),
			currentTotalFestaPoint: Math.floor(Math.random()*500000),
			circleRankInFestaSide: 1,
			circleRecordDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			isDailyBonus:false,
			participationRewardGet:true,
			receivedRewardBorder:0
		},
		userResultFestaData:{
			eventId:251016121,
			circleId:1,
			circleName:"CHUNI HISPANOS",
			festaSideId:1,
			circleRankInFestaSide: 1,
			receivedRewardBorder:0,
			circleTotalFestaPoint:200000,
			resultRewardGet:true
		}
	});
});

mai2Router.post("/Maimai2Servlet/GetUserNewItemListApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		userItemList: []
	});
});

mai2Router.post("/Maimai2Servlet/UploadUserPlaylogApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const body:{
        userId:number;
        userPlaylog:Mai2UserPlaylogType;
    } = req.body;

	const newPlaylog:Mai2UserPlaylogType = {
		...body.userPlaylog,
		userId: req.body.userId,
		playDate: dayjs(body.userPlaylog.playDate).toDate(),
		userPlayDate: dayjs(body.userPlaylog.userPlayDate).toDate()
	};

	await Mai2UserPlaylogModel.create(newPlaylog);

	res.json({
		"returnCode": 1,
		"apiName": "UploadUserPlaylogApi",
	});
});

mai2Router.post("/Maimai2Servlet/UploadUserPlaylogListApi", async (req, res) => {
	if (!req.body.userId) return res.json({});

	const body:{
        userId:number;
        userPlaylogList:Mai2UserPlaylogType[];
    } = req.body;

	if(req.body.userId === 281582350893057) {
		//     Guest account, do nothing
		return res.json({
			"returnCode": 1,
			"apiName": "UploadUserPlaylogListApi",
		});
	}

	const bulkOps = body.userPlaylogList.map(playlog => {
		return {
			insertOne: {
				document: {
					...playlog,
					userId: req.body.userId,
					playDate: dayjs(playlog.playDate).toDate(),
					userPlayDate: dayjs(playlog.userPlayDate).toDate(),
				}
			}
		};
	});

	if (bulkOps.length > 0) {
		await Mai2UserPlaylogModel.bulkWrite(bulkOps);
	}

	res.json({
		"returnCode": 1,
		"apiName": "UploadUserPlaylogListApi",
	});
});

mai2Router.post("/Maimai2Servlet/UploadUserPhotoApi", (_:Request, res) => {
	res.json({
		"returnCode": 1,
		"apiName": "Maimai2UploadUserPhotoApi",
	});
});

mai2Router.post("/Maimai2Servlet/UploadUserPortraitApi", (_:Request, res) => {
	res.json({
		"returnCode": 1,
		"apiName": "Maimai2UploadUserPortraitApi",
	});
});

mai2Router.post("/Maimai2Servlet/UpsertUserAllApi", async (req:Request, res) => {
	const body:{
        userId:string;
        upsertUserAll:Mai2UpsertUserAllRequest;
        regionId:number;
    } = req.body;

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	if(req.body.userId === 281582350893057 || req.body.userId === "282724812193793") {
		//     Guest account, do nothing
		return res.json({
			"returnCode": 1,
			"apiName": "Maimai2UpsertUserAllApi",
		});
	}

	if (body.upsertUserAll.userData && body.upsertUserAll.userData.length>0) {
		const newUserData = body.upsertUserAll.userData[0]!;

		newUserData.userId = body.userId;
		newUserData.version = version;
		newUserData.eventWatchedDate = newUserData.eventWatchedDate ? dayjs(newUserData.eventWatchedDate).toDate() :null;
		newUserData.lastLoginDate = newUserData.lastLoginDate ? dayjs(newUserData.lastLoginDate).toDate() :null;
		newUserData.lastPlayDate = newUserData.lastPlayDate ? dayjs(newUserData.lastPlayDate).toDate() :null;
		newUserData.firstPlayDate = newUserData.firstPlayDate ? dayjs(newUserData.firstPlayDate).toDate() :null;
		newUserData.dailyBonusDate = newUserData.dailyBonusDate ? dayjs(newUserData.dailyBonusDate).toDate() :null;
		newUserData.dailyCourseBonusDate = newUserData.dailyCourseBonusDate ? dayjs(newUserData.dailyCourseBonusDate).toDate() :null;
		newUserData.lastTrialPlayDate = newUserData.lastTrialPlayDate ? dayjs(newUserData.lastTrialPlayDate).toDate() :null;
		newUserData.naiveRating = await calculatePlayerNaiveRating(body.userId);

		await Mai2UserDataModel.findOneAndReplace({userId: body.userId, version}, newUserData, {upsert: true});
	}

	if (body.upsertUserAll.userExtend && body.upsertUserAll.userExtend.length>0) {
		const newUserExtend = body.upsertUserAll.userExtend[0]!;

		newUserExtend.userId = body.userId;

		await Mai2UserExtendModel.findOneAndReplace({userId: body.userId}, newUserExtend, {upsert: true});
	}

	if (body.upsertUserAll.userOption && body.upsertUserAll.userOption.length>0) {
		const newUserGameOption = body.upsertUserAll.userOption[0]!;

		newUserGameOption.userId = body.userId;

		await Mai2UserOptionModel.findOneAndReplace({userId: body.userId}, newUserGameOption, {upsert: true});
	}

	if (body.upsertUserAll.userRatingList && body.upsertUserAll.userRatingList.length>0) {
		const newUserRating = body.upsertUserAll.userRatingList[0]!;

		newUserRating.userId = body.userId;

		await Mai2UserRatingModel.findOneAndReplace({userId: body.userId}, newUserRating, {upsert: true});
	}

	if (body.upsertUserAll.userActivityList && body.upsertUserAll.userActivityList.length>0) {
		const newUserActivity = body.upsertUserAll.userActivityList[0]!;

		newUserActivity.userId = body.userId;

		await Mai2UserActivityModel.findOneAndReplace({userId: body.userId}, newUserActivity, {upsert: true});
	}

	if (body.upsertUserAll.userCharacterList && body.upsertUserAll.userCharacterList.length>0) {
		const bulkOps = body.upsertUserAll.userCharacterList.map(char => {
			char.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, characterId: char.characterId },
					update: { $set: char },
					upsert: true
				}
			};
		});

		await Mai2UserCharacterModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMissionDataList && body.upsertUserAll.userMissionDataList.length>0) {
		const bulkOps = body.upsertUserAll.userMissionDataList.map(mission => {
			mission.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, type: mission.type, difficulty:mission.difficulty},
					update: { $set: mission },
					upsert: true
				}
			};
		});

		await Mai2UserMissionModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userItemList && body.upsertUserAll.userItemList.length>0) {
		const bulkOps = body.upsertUserAll.userItemList.map(item => {
			item.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, itemId: item.itemId, itemKind: item.itemKind },
					update: { $set: item },
					upsert: true
				}
			};
		});

		await Mai2UserItemModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userLoginBonusList && body.upsertUserAll.userLoginBonusList.length>0) {
		const bulkOps = body.upsertUserAll.userLoginBonusList.map(bonus => {
			bonus.userId = body.userId;
			return {
				updateOne: {
					filter: {userId: body.userId, bonusId: bonus.bonusId},
					update: {$set: bonus},
					upsert: true
				}
			};
		});

		await Mai2UserLoginBonusModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMapList && body.upsertUserAll.userMapList.length>0) {
		const bulkOps = body.upsertUserAll.userMapList.map(map => {
			map.userId = body.userId;
			return {
				updateOne: {
					filter: {userId: body.userId, mapId: map.mapId},
					update: {$set: map},
					upsert: true
				}
			};
		});

		await Mai2UserMapModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMusicDetailList && body.upsertUserAll.userMusicDetailList.length>0) {
		const bulkOps = body.upsertUserAll.userMusicDetailList.map(music => {
			music.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, musicId: music.musicId, level: music.level },
					update: { $set: music },
					upsert: true
				}
			};
		});

		await Mai2UserMusicDetailModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userCourseList && body.upsertUserAll.userCourseList.length>0) {
		const bulkOps = body.upsertUserAll.userCourseList.map(course => {
			course.userId = body.userId;
			course.lastPlayDate = course.lastPlayDate ? dayjs(course.lastPlayDate).toDate() : null;
			course.clearDate = course.clearDate ? dayjs(course.clearDate).toDate() : null;
			course.bestAchievementDate = course.bestAchievementDate ? dayjs(course.bestAchievementDate).toDate() : null;
			course.bestDeluxscoreDate = course.bestDeluxscoreDate ? dayjs(course.bestDeluxscoreDate).toDate() : null;
			return {
				updateOne: {
					filter: {userId: body.userId, courseId: course.courseId},
					update: {$set: course},
					upsert: true
				}
			};
		});

		await Mai2UserCourseModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userFavoriteList && body.upsertUserAll.userFavoriteList.length>0) {
		const bulkOps = body.upsertUserAll.userFavoriteList.map(fav => {
			fav.userId = body.userId;
			return {
				updateOne: {
					filter: {userId: body.userId, itemKind: fav.itemKind},
					update: {$set: {itemIdList: fav.itemIdList}},
					upsert: true
				}
			};
		});

		console.log(body.upsertUserAll.userFavoriteList);

		await Mai2UserFavoriteModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userFriendSeasonRankingList && body.upsertUserAll.userFriendSeasonRankingList.length>0) {
		const bulkOps = body.upsertUserAll.userFriendSeasonRankingList.map(rank => {
			rank.userId = body.userId;
			rank.recordDate = dayjs(rank.recordDate).toDate();
			return {
				updateOne: {
					filter: {userId: body.userId, seasonId: rank.seasonId},
					update: {$set: rank},
					upsert: true
				}
			};
		});

		await Mai2UserFriendSeasonRankingModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userKaleidxScopeList && body.upsertUserAll.userKaleidxScopeList.length>0) {
		const bulkOps = body.upsertUserAll.userKaleidxScopeList.map(scope => {
			scope.userId = body.userId;
			scope.clearDate = scope.clearDate ? dayjs(scope.clearDate).toDate() : null;
			scope.lastPlayDate = scope.lastPlayDate ? dayjs(scope.lastPlayDate).toDate() : null;
			scope.bestAchievementDate = scope.bestAchievementDate ? dayjs(scope.bestAchievementDate).toDate() :null;
			scope.bestDeluxscoreDate = scope.bestDeluxscoreDate ? dayjs(scope.bestDeluxscoreDate).toDate() : null;
			return {
				updateOne: {
					filter: {userId: body.userId, gateId: scope.gateId},
					update: {$set: scope},
					upsert: true
				}
			};
		});

		await Mai2UserKaleidxScopeModel.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userIntimateList && body.upsertUserAll.userIntimateList.length>0) {
		const bulkOps = body.upsertUserAll.userIntimateList.map(intimate => {
			intimate.userId = body.userId;
			return {
				updateOne: {
					filter: {userId: body.userId, partnerId: intimate.partnerId},
					update: {$set: intimate},
					upsert: true
				}
			};
		});

		await Mai2UserIntimateModel.bulkWrite(bulkOps);
	}

	res.json({
		"returnCode": 1,
		"apiName": "Maimai2UpsertUserAllApi",
	});
});

mai2Router.post("/Maimai2Servlet/UserLogoutApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const playedRegion = req.body.regionId;

	await Mai2UserRegionModel.findOneAndUpdate({userId: req.body.userId, regionId: playedRegion}, {
		$inc: { playCount: 1 }
	}, { upsert: true });

	res.json({
		"returnCode": 1,
		"apiName": "Maimai2UserLogoutApi",
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
	"CreateTokenApi",
	"DeleteTokenApi",
	"RemoveTokenApi",
	"UpsertClientSettingApi",
	"UpsertClientTestmodeApi",
	"Ping",
	"UserLogoutApi"
].map(ep=>"/Maimai2Servlet/" + ep);

mai2Router.post(noOpEndpoints, noOpFunction);

export default mai2Router;