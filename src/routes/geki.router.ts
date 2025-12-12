import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {Router, type Request, type RequestHandler} from "express";
import type {GekiUpsertUserAllRequest} from "../games/geki/types/userdata.types.ts";
import {log} from "../utils/general.ts";
import {GekiUserData} from "../games/geki/models/userdata.model.ts";
import {GekiUserGameOption} from "../games/geki/models/usergameoption.model.ts";
import {GekiUserCharacter} from "../games/geki/models/usercharacter.model.ts";
import {GekiUserItem, GekiUserMusicItem} from "../games/geki/models/useritem.model.ts";
import {GekiUserActivity} from "../games/geki/models/useractivity.model.ts";
import {GekiUserMusicDetail} from "../games/geki/models/usermusicdetail.model.ts";
import {GekiUserCard} from "../games/geki/models/usercard.model.ts";
import {GekiUserChapter, GekiUserMemoryChapter} from "../games/geki/models/userchapter.model.ts";
import {GekiUserDeck} from "../games/geki/models/userdeck.model.ts";
import {GekiUserLoginBonus} from "../games/geki/models/userloginbonus.model.ts";
import type {GekiUserMusicDetailType} from "../games/geki/types/usermusicdetail.types.ts";
import {GekiUserPlaylog} from "../games/geki/models/userplaylog.model.ts";
import {GekiUserMisc} from "../games/geki/models/usermisc.model.ts";
import {GekiUserMissionPoint} from "../games/geki/models/usermissionpoint.model.ts";
import {GekiUserEventPoint} from "../games/geki/models/usereventpoint.model.ts";
import {GekiUserStory} from "../games/geki/models/userstory.model.ts";
import {GekiUserTrainingRoom} from "../games/geki/models/usertrainingroom.model.ts";
import {GekiUserBoss} from "../games/geki/models/userboss.model.ts";
import {GekiUserTechCount} from "../games/geki/models/usertechcount.model.ts";
import {GekiUserScenario} from "../games/geki/models/userscenario.model.ts";
import {GekiUserTradeItem} from "../games/geki/models/usertradeitem.model.ts";
import {GekiUserEventMusic} from "../games/geki/models/usereventmusic.model.ts";
import {GekiUserTechEvent} from "../games/geki/models/usertechevent.model.ts";
import {GekiUserKop} from "../games/geki/models/userkop.model.ts";
import {GekiUserEventMap} from "../games/geki/models/usereventmap.model.ts";
import {GekiUserRatingLog} from "../games/geki/models/userratinglog.model.ts";
import {GekiUserRegion} from "../games/geki/models/userregion.model.ts";
import {GekiGameEvent} from "../games/geki/models/gameevent.model.ts";
import {getGekiPBs} from "../utils/kt.ts";
import {deleteRedisKey} from "../modules/redis.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/ongeki/:ver/"
const gekiRouter = Router({mergeParams:true});

gekiRouter.post("/GetGameSettingApi", (req:Request, res) => {
	const version = req.params.ver || "1.00";

	const now = dayjs().tz("Asia/Tokyo");

	const jstRebootStatTime = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
	const jstRebootEndTime = now.subtract(3, "hour").format("YYYY-MM-DD HH:mm:ss");

	res.json({
		gameSetting:{
			dataVersion:version,
			onlineDataVersion:version,
			isMaintenance:false,
			requestInterval:10,
			rebootStartTime:jstRebootStatTime,
			rebootEndTime: jstRebootEndTime,
			isBackgroundDistribute:false,
			maxCountCharacter:300,
			maxCountCard:300,
			maxCountItem:300,
			maxCountMusic:300,
			maxCountMusicItem:300,
			maxCountRivalMusic:3
		},
		isDumpUpload:false,
		isAou:false,
	});
});

gekiRouter.post("/GetGameEventApi", async (_, res) => {
	const gameEvents = await GekiGameEvent.find({active:true}).lean();

	res.json({
		type:1,
		length:gameEvents.length,
		gameEventList:gameEvents.map(ev=>({
			id:ev.eventId,
			type:1,
			startDate:"2020-01-01 00:00:01.0",
			endDate:"2099-01-01 05:00:00.0",
		}))
	});
});

gekiRouter.post("/GetGameRankingApi", async (req, res) => {
	const popularSongsLast30Days = await GekiUserPlaylog.aggregate<{_id:number, playCount:number}>()
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
		.limit(9)
		.exec();

	if(popularSongsLast30Days.length < 9) {
		return res.json({
			type:req.body.type,
			gameRankingList:Array(10).fill({
				id: 763,
				point:999,
				userName:""
			})
		});
	}

	res.json({
		type:req.body.type,
		gameRankingList:[
			{
				id: 763,
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

gekiRouter.post("/GetGamePointApi", (_, res) => {
	res.json({
		length:6,
		gamePointList: [
			{
				type:0,
				cost:120,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}, {
				type:1,
				cost:240,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}, {
				type:2,
				cost:360,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}, {
				type:3,
				cost:360,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}, {
				type:4,
				cost:720,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}, {
				type:5,
				cost:1080,
				startDate:"2000-01-01 05:00:00.0",
				endDate:"2099-12-31 23:59:59.0",
			}
		]
	});
});

gekiRouter.post("/GetGameRewardApi", (_, res) => {
	res.json({
		length:0,
		gameRewardList: []
	});
});

gekiRouter.post("/GetGamePresentApi", (_, res) => {
	res.json({
		length:0,
		gamePresentList: []
	});
});

gekiRouter.post("/GetGameTechMusicApi", async (_, res) => {
	const eventsWithSongs = await GekiGameEvent.find({active:true, songs:{$exists:true}}, {songs:1, eventId:1, _id:0}).lean();

	const allSongs = eventsWithSongs.reduce<{eventId:bigint, musicId:number, level:number}[]>((acc, ev) => {
		const evSongs = ev.songs || [];

		// Si no hay canciones lunáticas y hay pocas canciones, se repiten
		if(!evSongs.some(s=>s>8000)){
			if(evSongs.length===1){
				acc = acc.concat([0, 1, 2, 3].map(l=>({
					eventId:ev.eventId,
					musicId:evSongs[0]!,
					level:l
				})));
			}else if(evSongs.length===2){
				acc = acc.concat([2, 3].map(l=>({
					eventId:ev.eventId,
					musicId:evSongs[0]!,
					level:l
				}))).concat([2, 3].map(l=>({
					eventId:ev.eventId,
					musicId:evSongs[1]!,
					level:l
				})));
			}else{
				acc = acc.concat(evSongs.map(s=>({
					eventId:ev.eventId,
					musicId: s,
					level: 3
				})));
			}
		}else{
			acc = acc.concat(evSongs.map(s=>({
				eventId:ev.eventId,
				musicId: s,
				level: s>8000 ? 4 : 3
			})));
		}
		return acc;
	}, []);

	res.json({
		length:allSongs.length,
		gameTechMusicList: allSongs
	});
});

gekiRouter.post("/GetUserPreviewApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const newUser = {
		userId: req.body.userId,
		isLogin:false,
		lastLoginDate: "0000-00-00 00:00:00",
		userName:"",
		reincarnationNum:0,
		level:0,
		exp:0,
		playerRating:0,
		newPlayerRating:0,
		lastGameId:"",
		lastRomVersion:"",
		lastDataVersion:"",
		lastPlayDate:"",
		nameplateId:0,
		trophyId:0,
		cardId:0,
		dispPlayerLv:0,
		dispRating:0,
		dispBP:0,
		headphone:0,
		banStatus:0,
		isWarningConfirmed:true
	};

	const foundUserData = await GekiUserData.findOne({userId: req.body.userId, version:{$lte: version}}, {
		lastLoginDate:1,
		userName:1,
		reincarnationNum:1,
		level:1,
		exp:1,
		playerRating:1,
		newPlayerRating:1,
		lastGameId:1,
		lastRomVersion:1,
		lastDataVersion:1,
		lastPlayDate:1,
		nameplateId:1,
		trophyId:1,
		cardId:1,
	}).sort({version:-1}).lean();

	if(!foundUserData) return res.json(newUser);

	const foundUserOption = await GekiUserGameOption.findOne({userId: req.body.userId}, {
		dispPlayerLv:1,
		dispRating:1,
		dispBP:1,
		headphone:1,
		_id:0
	}).lean();

	res.json({
		...foundUserData,
		...foundUserOption,
		userId: req.body.userId,
		isLogin:false
	});
});

gekiRouter.post("/GetUserMusicItemApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const foundUserMusicItems = await GekiUserMusicItem.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:foundUserMusicItems.length,
		nextIndex:-1,
		userMusicItemList: foundUserMusicItems
	});
});

gekiRouter.post("/GetUserBossApi", async (req, res) => {
	if(!req.body.userId) return res.json({});

	const foundUserBosses = await GekiUserBoss.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:foundUserBosses.length,
		userBossList: foundUserBosses
	});
});

gekiRouter.post("/GetUserMusicApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userMusicDetails = await GekiUserMusicDetail.aggregate<{
        _id: number;
        musicDetails: GekiUserMusicDetailType[];
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
		nextIndex:-1,
		userMusicList: musicDetails
	});
});

gekiRouter.post("/GetUserDataApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await GekiUserData.findOne({userId: req.body.userId, version:{$lte: version}}).sort({version:-1}).lean();

	if(!foundUserData) return res.json({});

	res.json({
		"userId": req.body.userId,
		"userData": {
			...foundUserData,
			eventWatchedDate: dayjs(foundUserData.eventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0"),
			cmEventWatchedDate: dayjs(foundUserData.cmEventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0"),
			firstPlayDate: dayjs(foundUserData.firstPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
			lastPlayDate: dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
		}
	});
});

gekiRouter.post("/GetUserRivalApi", async (req:Request, res) => {
	const userMisc = await GekiUserMisc.findOne({userId: req.body.userId}, {rivalList:1}).lean();

	if(!userMisc || !userMisc.rivalList || !userMisc.rivalList.length) return res.json({
		userId:req.body.userId,
		length:0,
		userRivalList:[]
	});

	res.json({
		userId:req.body.userId,
		length:userMisc.rivalList.length,
		userRivalList:userMisc.rivalList
	});
});

gekiRouter.post("/GetUserRivalDataApi", async (req:Request, res) => {
	const userMisc = await GekiUserMisc.findOne({userId: req.body.userId}, {rivalList:1}).lean();

	if(!userMisc || !userMisc.rivalList || !userMisc.rivalList.length) return res.json({
		userId:req.body.userId,
		length:0,
		userRivalList:[]
	});

	res.json({
		userId:req.body.userId,
		length:userMisc.rivalList.length,
		userRivalDataList:userMisc.rivalList
	});
});

gekiRouter.post("/GetUserRivalMusicApi", async (req:Request, res) => {
	const rivalId = req.body.rivalUserId;

	const userMisc = await GekiUserMisc.findOne({userId: req.body.userId}, {rivalList:1}).lean();

	if(!userMisc || !userMisc.rivalList || !userMisc.rivalList.length) return res.json({
		userId:req.body.userId,
		rivalUserId:rivalId,
		length:0,
		nextIndex:-1,
		userRivalMusicList:[]
	});

	const rivalInfo = userMisc.rivalList.find(r=>r.rivalUserId===rivalId);

	if(!rivalInfo) return res.json({
		userId:req.body.userId,
		rivalUserId:rivalId,
		length:0,
		nextIndex:-1,
		userRivalMusicList:[]
	});

	const rivalPBs = await getGekiPBs(rivalInfo.rivalUserName);

	res.json({
		userId:req.body.userId,
		rivalUserId:rivalId,
		nextIndex: -1,
		length:rivalPBs.length,
		userRivalMusicList:rivalPBs
	});
});

gekiRouter.post("/GetUserTechCountApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userTechCounts = await GekiUserTechCount.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userTechCounts.length,
		userTechCountList:userTechCounts
	});
});

gekiRouter.post("/GetUserCardApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userCards = await GekiUserCard.find({userId: req.body.userId}).sort({cardId: 1}).lean();

	res.json({
		userId:req.body.userId,
		length:userCards.length,
		nextIndex:-1,
		userCardList: userCards.map(card => ({
			...card,
			kaikaDate: card.kaikaDate ? dayjs(card.kaikaDate).format("YYYY-MM-DD HH:mm:ss.0") : "0000-00-00 00:00:00.0",
			choKaikaDate: card.choKaikaDate ? dayjs(card.choKaikaDate).format("YYYY-MM-DD HH:mm:ss.0") : "0000-00-00 00:00:00.0",
			created: dayjs(card.created).format("YYYY-MM-DD HH:mm:ss.0"),
		}))
	});
});

gekiRouter.post("/GetUserCharacterApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userCharacters = await GekiUserCharacter.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userCharacters.length,
		nextIndex: -1,
		userCharacterList: userCharacters
	});
});

gekiRouter.post("/GetUserStoryApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userStories = await GekiUserStory.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userStories.length,
		userStoryList: userStories
	});
});

gekiRouter.post("/GetUserChapterApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userChapters = await GekiUserChapter.find({userId: req.body.userId}).sort({chapterId: 1}).lean();

	res.json({
		userId: req.body.userId,
		length: userChapters.length,
		userChapterList: userChapters
	});
});

gekiRouter.post("/GetUserMemoryChapterApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMemoryChapters = await GekiUserMemoryChapter.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userMemoryChapters.length,
		nextIndex: -1,
		userMemoryChapterList: userMemoryChapters
	});
});

gekiRouter.post("/GetUserDeckByKeyApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userDecks = await GekiUserDeck.find({userId: req.body.userId}).sort({deckId: 1}).lean();

	res.json({
		userId: req.body.userId,
		length: userDecks.length,
		userDeckList: userDecks
	});
});

gekiRouter.post("/GetUserSkinApi", async (req:Request, res) => {
	// TODO: investigar qué es esto
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 0,
		userSkinList: []
	});
});

gekiRouter.post("/GetUserTrainingRoomByKeyApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userTrainingRooms = await GekiUserTrainingRoom.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userTrainingRooms.length,
		userTrainingRoomList: userTrainingRooms
	});
});

gekiRouter.post("/GetUserOptionApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUserOption = await GekiUserGameOption.findOne({userId: req.body.userId}, {_id:0}).lean();

	if (!foundUserOption) return res.json({});

	res.json({
		userId: req.body.userId,
		userOption: foundUserOption
	});
});

gekiRouter.post("/GetUserActivityApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = req.body.kind || 0;

	const userActivity = await GekiUserActivity.find({userId: req.body.userId, kind:parseInt(kind)}, {_id:0, userId:0, __v:0}).lean();

	if (!userActivity.length) return res.json({
		userId:req.body.userId,
		length:0,
		kind:parseInt(kind),
		userActivityList:[]
	});

	res.json({
		userId:req.body.userId,
		length:userActivity.length,
		kind:parseInt(kind),
		userActivityList:userActivity
	});
});

gekiRouter.post("/GetUserRatinglogApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userRatingLogs = await GekiUserRatingLog.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userRatingLogs.length,
		userRatinglogList:userRatingLogs
	});
});

gekiRouter.post("/GetUserRecentRatingApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMisc = await GekiUserMisc.findOne({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length: userMisc?.userRecentRatingList?.length || 0,
		userRecentRatingList:userMisc?.userRecentRatingList || []
	});
});

gekiRouter.post("/GetUserItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = Math.floor(req.body.nextIndex / 10000000000);

	const userItems = await GekiUserItem.find({userId: req.body.userId, itemKind: kind}, {_id:0, userId:0, __v:0}).lean();

	if (!userItems) return res.json({
		userId:req.body.userId,
		length:0,
		nextIndex:-1,
		userItemList:[]
	});

	res.json({
		userId:req.body.userId,
		length:userItems.length,
		itemKind:kind,
		nextIndex:-1,
		userItemList:userItems
	});
});

gekiRouter.post("/GetUserEventPointApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userEventPoints = await GekiUserEventPoint.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userEventPoints.length,
		userEventPointList:userEventPoints
	});
});

gekiRouter.post("/GetUserEventRankingApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userEvents = await GekiUserEventPoint.find({userId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: userEvents.length,
		userEventRankingList: userEvents.map(ev => ({
			eventId: ev.eventId,
			type: 1,
			date: dayjs().format("YYYY-MM-DD HH:mm:ss.0"),
			// Solo se puede ser primero
			rank: 1,
			point: ev.point
		}))
	});
});

gekiRouter.post("/GetUserMissionPointApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMissionPoints = await GekiUserMissionPoint.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userMissionPoints.length,
		userMissionPointList:userMissionPoints
	});
});

gekiRouter.post("/GetUserLoginBonusApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userLoginBonuses = await GekiUserLoginBonus.find({userId: req.body.userId}, {_id:0, __v:0}).lean();

	res.json({
		userId: req.body.userId,
		length: userLoginBonuses.length,
		userLoginBonusList: userLoginBonuses.map(bonus => ({
			...bonus,
			lastUpdateDate: dayjs(bonus.lastUpdateDate).format("YYYY-MM-DD HH:mm:ss.0"),
		}))
	});
});

gekiRouter.post("/GetUserRegionApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userRegions = await GekiUserRegion.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userRegions.length,
		userRegionList:userRegions
	});
});

gekiRouter.post("/GetUserScenarioApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userScenarios = await GekiUserScenario.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userScenarios.length,
		userScenarioList:userScenarios
	});
});

gekiRouter.post("/GetUserTradeItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const startChapter = req.body.startChapterId || 0;
	const endChapter = req.body.endChapterId || 99999;

	const userTradeItems = await GekiUserTradeItem.find({userId: req.body.userId, chapterId: {$gte: startChapter, $lte: endChapter}}).lean();

	res.json({
		userId:req.body.userId,
		length:userTradeItems.length,
		userTradeItemList:userTradeItems
	});
});

gekiRouter.post("/GetUserEventMapApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const eventId = req.body.eventId;
	const mapId = req.body.mapId;

	const userEventMap = await GekiUserEventMap.findOne({userId: req.body.userId, eventId, mapId}).lean();

	if (!userEventMap) return res.json({
		userId:req.body.userId,
		userEventMap: null
	});

	res.json({
		userId:req.body.userId,
		userEventMap
	});
});

gekiRouter.post("/GetUserEventMusicApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userEventMusics = await GekiUserEventMusic.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userEventMusics.length,
		userEventMusicList:userEventMusics
	});
});

gekiRouter.post("/GetUserTechEventApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userTechEvents = await GekiUserTechEvent.find({userId: req.body.userId}, {_id:0, __v:0, userId:0}).lean();

	res.json({
		userId:req.body.userId,
		length:userTechEvents.length,
		userTechEventList:userTechEvents
	});
});

gekiRouter.post("/GetUserTechEventRankingApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userTechEvents = await GekiUserTechEvent.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userTechEvents.length,
		userTechEventRankingList:userTechEvents.map(ev=>({
			eventId:ev.eventId,
			date: dayjs().format("YYYY-MM-DD HH:mm:ss.0"),
			// Solo se puede ser primero
			rank:1,
			totalTechScore:ev.totalTechScore,
			totalPlatinumScore:ev.totalPlatinumScore
		}))
	});
});

gekiRouter.post("/GetUserKopApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const userKops = await GekiUserKop.find({userId: req.body.userId}).lean();

	res.json({
		userId:req.body.userId,
		length:userKops.length,
		userKopList:userKops
	});
});

gekiRouter.post("/UpsertUserAllApi", async (req, res) => {
	const body:{
        userId:string;
        upsertUserAll:GekiUpsertUserAllRequest & Record<string, unknown[]>;
        regionId:number;
    } = req.body;

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	if(req.body.userId === 282724812193793) {
		//     Guest account, do nothing
		return res.json({
			"returnCode": 1,
			"apiName": "UpsertUserAllApi",
		});
	}

	if (body.upsertUserAll.userData && body.upsertUserAll.userData.length>0) {
		// clear userdata cache
		deleteRedisKey("GetUserDataApi", body.userId);
		deleteRedisKey("CMGetUserDataApi", body.userId);
		deleteRedisKey("GetUserPreviewApi", body.userId);

		const newUserData = body.upsertUserAll.userData[0]!;

		newUserData.userId = body.userId;
		newUserData.version = version;
		newUserData.eventWatchedDate = dayjs(newUserData.eventWatchedDate).toDate();
		newUserData.cmEventWatchedDate = dayjs(newUserData.cmEventWatchedDate).toDate();
		newUserData.firstPlayDate = dayjs(newUserData.firstPlayDate).toDate();
		newUserData.lastPlayDate = dayjs(newUserData.lastPlayDate).toDate();

		await GekiUserData.findOneAndReplace({userId: body.userId, version}, newUserData, {upsert: true});
	}

	if (body.upsertUserAll.userOption && body.upsertUserAll.userOption.length>0) {
		// clear gameoption cache
		deleteRedisKey("GetUserOptionApi", body.userId);

		const newUserGameOption = body.upsertUserAll.userOption[0]!;

		newUserGameOption.userId = body.userId;

		await GekiUserGameOption.findOneAndReplace({userId: body.userId}, newUserGameOption, {upsert: true});
	}

	if (body.upsertUserAll.userCharacterList && body.upsertUserAll.userCharacterList.length>0) {
		// clear userchars cache
		deleteRedisKey("GetUserCharacterApi", body.userId);
		deleteRedisKey("CMGetUserCharacterApi", body.userId);

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

		await GekiUserCharacter.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userItemList && body.upsertUserAll.userItemList.length>0) {
		// clear useritems cache
		deleteRedisKey("GetUserItemApi", body.userId);
		deleteRedisKey("CMGetUserItemApi", body.userId);

		const bulkOps = body.upsertUserAll.userItemList.map(item => {
			item.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, itemId: item.itemId },
					update: { $set: item },
					upsert: true
				}
			};
		});

		await GekiUserItem.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMusicDetailList && body.upsertUserAll.userMusicDetailList.length>0) {
		// clear musicdetails cache
		deleteRedisKey("GetUserMusicApi", body.userId);

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

		await GekiUserMusicDetail.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userActivityList && body.upsertUserAll.userActivityList.length>0) {
		// clear activity cache
		deleteRedisKey("GetUserActivityApi", body.userId);

		const bulkOps = body.upsertUserAll.userActivityList.map(activity => {
			activity.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, kind: activity.kind, id: activity.id },
					update: { $set: activity },
					upsert: true
				}
			};
		});

		await GekiUserActivity.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userCardList && body.upsertUserAll.userCardList.length>0) {
		// clear card cache
		deleteRedisKey("GetUserCardApi", body.userId);
		deleteRedisKey("CMGetUserCardApi", body.userId);

		const bulkOps = body.upsertUserAll.userCardList.map(card => {
			card.userId = body.userId;
			card.kaikaDate = dayjs(card.kaikaDate).toDate().getTime()>1 ? dayjs(card.kaikaDate).toDate() : undefined;
			card.choKaikaDate = dayjs(card.choKaikaDate).toDate().getTime()>1 ? dayjs(card.choKaikaDate).toDate() : undefined;
			card.created = dayjs(card.created).toDate();
			return {
				updateOne: {
					filter: { userId: body.userId, cardId: card.cardId },
					update: { $set: card },
					upsert: true
				}
			};
		});

		await GekiUserCard.bulkWrite(bulkOps);
	}

	if(body.upsertUserAll.userChapterList && body.upsertUserAll.userChapterList.length>0) {
		// clear chapter cache
		deleteRedisKey("GetUserChapterApi", body.userId);

		const bulkOps = body.upsertUserAll.userChapterList.map(chapter => {
			chapter.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, chapterId: chapter.chapterId },
					update: { $set: chapter },
					upsert: true
				}
			};
		});

		await GekiUserChapter.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMemoryChapterList && body.upsertUserAll.userMemoryChapterList.length>0) {
		// clear chapter cache
		deleteRedisKey("GetUserMemoryChapterApi", body.userId);

		const bulkOps = body.upsertUserAll.userMemoryChapterList.map(chapter => {
			chapter.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, chapterId: chapter.chapterId },
					update: { $set: chapter },
					upsert: true
				}
			};
		});

		await GekiUserMemoryChapter.bulkWrite(bulkOps);
	}

	if(body.upsertUserAll.userDeckList && body.upsertUserAll.userDeckList.length>0) {
		// clear deck cache
		deleteRedisKey("GetUserDeckByKeyApi", body.userId);

		const bulkOps = body.upsertUserAll.userDeckList.map(deck => {
			deck.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, deckId: deck.deckId },
					update: { $set: deck },
					upsert: true
				}
			};
		});

		await GekiUserDeck.bulkWrite(bulkOps);
	}

	if(body.upsertUserAll.userLoginBonusList && body.upsertUserAll.userLoginBonusList.length>0) {
		// clear login bonus cache
		deleteRedisKey("GetUserLoginBonusApi", body.userId);

		const bulkOps = body.upsertUserAll.userLoginBonusList.map(bonus => {
			bonus.userId = body.userId;
			bonus.lastUpdateDate = dayjs(bonus.lastUpdateDate).toDate();
			return {
				updateOne: {
					filter: { userId: body.userId, bonusId: bonus.bonusId },
					update: { $set: bonus },
					upsert: true
				}
			};
		});

		await GekiUserLoginBonus.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userPlaylogList && body.upsertUserAll.userPlaylogList.length>0) {
		const bulkOps = body.upsertUserAll.userPlaylogList.map(log => {
			log.userId = body.userId;
			return {
				insertOne: {
					document: log
				}
			};
		});

		await GekiUserPlaylog.bulkWrite(bulkOps);

		// Actualizar también la región del usuario
		const region = body.regionId;

		await GekiUserRegion.findOneAndUpdate({userId: body.userId, regionId: region}, {
			$inc:{ playCount: 1 },
		}, { upsert: true });
	}

	if (body.upsertUserAll.userMissionPointList && body.upsertUserAll.userMissionPointList.length>0) {
		// clear mission cache
		deleteRedisKey("GetUserMissionPointApi", body.userId);

		const bulkOps = body.upsertUserAll.userMissionPointList.map(point => {
			point.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, eventId: point.eventId },
					update: { $set: point },
					upsert: true
				}
			};
		});

		await GekiUserMissionPoint.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userEventPointList && body.upsertUserAll.userEventPointList.length>0) {
		// clear event cache
		deleteRedisKey("GetUserEventPointApi", body.userId);

		const bulkOps = body.upsertUserAll.userEventPointList.map(point => {
			point.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, eventId: point.eventId },
					update: { $set: point },
					upsert: true
				}
			};
		});

		await GekiUserEventPoint.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userStoryList && body.upsertUserAll.userStoryList.length>0) {
		// clear story cache
		deleteRedisKey("GetUserStoryApi", body.userId);

		const bulkOps = body.upsertUserAll.userStoryList.map(story => {
			story.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, storyId: story.storyId },
					update: { $set: story },
					upsert: true
				}
			};
		});

		await GekiUserStory.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userTrainingRoomList && body.upsertUserAll.userTrainingRoomList.length>0) {
		// clear training cache
		deleteRedisKey("GetUserTrainingRoomByKeyApi", body.userId);

		const bulkOps = body.upsertUserAll.userTrainingRoomList.map(room => {
			room.userId = body.userId;
			room.valueDate = dayjs(room.valueDate).toDate();
			return {
				updateOne: {
					filter: { userId: body.userId, roomId: room.roomId },
					update: { $set: room },
					upsert: true
				}
			};
		});

		await GekiUserTrainingRoom.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMusicItemList && body.upsertUserAll.userMusicItemList.length>0) {
		// clear music item cache
		deleteRedisKey("GetUserMusicItemApi", body.userId);

		const bulkOps = body.upsertUserAll.userMusicItemList.map(item => {
			item.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, musicId: item.musicId },
					update: { $set: item },
					upsert: true
				}
			};
		});

		await GekiUserMusicItem.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userBossList && body.upsertUserAll.userBossList.length>0) {
		// clear boss cache
		deleteRedisKey("GetUserBossApi", body.userId);

		const bulkOps = body.upsertUserAll.userBossList.map(boss => {
			boss.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, musicId: boss.musicId },
					update: { $set: boss },
					upsert: true
				}
			};
		});

		await GekiUserBoss.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userTechCountList && body.upsertUserAll.userTechCountList.length>0) {
		// clear techcount cache
		deleteRedisKey("GetUserTechCountApi", body.userId);

		const bulkOps = body.upsertUserAll.userTechCountList.map(count => {
			count.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, levelId: count.levelId },
					update: { $set: count },
					upsert: true
				}
			};
		});

		await GekiUserTechCount.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userScenarioList && body.upsertUserAll.userScenarioList.length>0) {
		// clear scenario cache
		deleteRedisKey("GetUserScenarioApi", body.userId);

		const bulkOps = body.upsertUserAll.userScenarioList.map(scenario => {
			scenario.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, scenarioId: scenario.scenarioId },
					update: { $set: scenario },
					upsert: true
				}
			};
		});

		await GekiUserScenario.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userTradeItemList && body.upsertUserAll.userTradeItemList.length>0) {
		// clear tradeitem cache
		deleteRedisKey("GetUserTradeItemApi", body.userId);

		const bulkOps = body.upsertUserAll.userTradeItemList.map(item => {
			item.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, tradeItemId: item.tradeItemId, chapterId: item.chapterId },
					update: { $set: item },
					upsert: true
				}
			};
		});

		await GekiUserTradeItem.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userEventMusicList && body.upsertUserAll.userEventMusicList.length>0) {
		// clear event music cache
		deleteRedisKey("GetUserEventMusicApi", body.userId);

		const bulkOps = body.upsertUserAll.userEventMusicList.map(music => {
			music.userId = body.userId;
			music.techRecordDate = dayjs(music.techRecordDate).toDate();
			return {
				updateOne: {
					filter: { userId: body.userId, eventId: music.eventId, musicId: music.musicId, type: music.type, level: music.level },
					update: { $set: music },
					upsert: true
				}
			};
		});

		await GekiUserEventMusic.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userTechEventList && body.upsertUserAll.userTechEventList.length>0) {
		// clear tech event cache
		deleteRedisKey("GetUserTechEventApi", body.userId);

		const bulkOps = body.upsertUserAll.userTechEventList.map(event => {
			event.userId = body.userId;
			event.techRecordDate = dayjs(event.techRecordDate).toDate();
			return {
				updateOne: {
					filter: { userId: body.userId, eventId: event.eventId },
					update: { $set: event },
					upsert: true
				}
			};
		});

		await GekiUserTechEvent.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userKopList && body.upsertUserAll.userKopList.length>0) {
		// clear kop cache
		deleteRedisKey("GetUserKopApi", body.userId);

		const bulkOps = body.upsertUserAll.userKopList.map(kop => {
			kop.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, kopId: kop.kopId, areaId: kop.areaId },
					update: { $set: kop },
					upsert: true
				}
			};
		});

		await GekiUserKop.bulkWrite(bulkOps);
	}

	if(body.upsertUserAll.userEventMap) {
		// clear event map cache
		deleteRedisKey("GetUserEventMapApi", body.userId);

		const eventMap = body.upsertUserAll.userEventMap;
		eventMap.userId = body.userId;

		await GekiUserEventMap.findOneAndReplace({userId: body.userId, eventId: eventMap.eventId, mapId: eventMap.mapId}, eventMap, {upsert: true});
	}

	if(body.upsertUserAll.userRatinglogList && body.upsertUserAll.userRatinglogList.length>0) {
		// clear rating log cache
		deleteRedisKey("GetUserRatinglogApi", body.userId);

		const bulkOps = body.upsertUserAll.userRatinglogList.map(rating => {
			rating.userId = body.userId;
			return {
				updateOne: {
					filter: { userId: body.userId, dataVersion:rating.dataVersion },
					update: { $set: rating },
					upsert: true
				}
			};
		});

		await GekiUserRatingLog.bulkWrite(bulkOps);
	}

	// TODO revisar si esto está funcionando
	await GekiUserMisc.findOneAndUpdate({userId: body.userId}, {
		userRecentRatingList: body.upsertUserAll.userRecentRatingList || [],
		userBpBaseList: body.upsertUserAll.userBpBaseList || [],
		userRatingBaseBestNewList: body.upsertUserAll.userRatingBaseBestNewList || [],
		userRatingBaseBestList: body.upsertUserAll.userRatingBaseBestList || [],
		userRatingBaseHotList: body.upsertUserAll.userRatingBaseHotList || [],
		userRatingBaseNextNewList: body.upsertUserAll.userRatingBaseNextNewList || [],
		userRatingBaseNextList: body.upsertUserAll.userRatingBaseNextList || [],
		userRatingBaseHotNextList: body.upsertUserAll.userRatingBaseHotNextList || [],
		userNewRatingBasePScoreList: body.upsertUserAll.userNewRatingBasePScoreList || [],
		userNewRatingBaseBestList: body.upsertUserAll.userNewRatingBaseBestList || [],
		userNewRatingBaseBestNewList: body.upsertUserAll.userNewRatingBaseBestNewList || [],
		userNewRatingBaseNextPScoreList: body.upsertUserAll.userNewRatingBaseNextPScoreList || [],
		userNewRatingBaseNextBestList: body.upsertUserAll.userNewRatingBaseNextBestList || [],
		userNewRatingBaseNextBestNewList: body.upsertUserAll.userNewRatingBaseNextBestNewList || []
	}, {upsert: true});

	const implementedFields = [
		"userData",
		"userOption",
		"userCharacterList",
		"userItemList",
		"userMusicDetailList",
		"userActivityList",
		"userCardList",
		"userChapterList",
		"userMemoryChapterList",
		"userDeckList",
		"userLoginBonusList",
		"userPlaylogList",
		"userRecentRatingList",
		"userBpBaseList",
		"userRatingBaseBestNewList",
		"userRatingBaseBestList",
		"userRatingBaseHotList",
		"userRatingBaseNextNewList",
		"userRatingBaseNextList",
		"userRatingBaseHotNextList",
		"userNewRatingBasePScoreList",
		"userNewRatingBaseBestList",
		"userNewRatingBaseBestNewList",
		"userNewRatingBaseNextPScoreList",
		"userNewRatingBaseNextBestList",
		"userNewRatingBaseNextBestNewList",
		"userMissionPointList",
		"userEventPointList",
		"userStoryList",
		"userTrainingRoomList",
		"userMusicItemList",
		"userBossList",
		"userTechCountList",
		"userScenarioList",
		"userTradeItemList",
		"userEventMusicList",
		"userTechEventList",
		"userKopList",
		"userEventMap",
		"userRatinglogList"
	];

	if (Object.keys(body.upsertUserAll).some(key => !implementedFields.includes(key) && (body.upsertUserAll)[key] && (body.upsertUserAll)[key].length > 0)) {
		const unimplemented = Object.keys(body.upsertUserAll).filter(key => !implementedFields.includes(key) && (body.upsertUserAll)[key] && (body.upsertUserAll)[key].length > 0 && !key.startsWith("is"));

		if (unimplemented.length) {
			log("error", "geki", `El usuario ${body.userId} ha intentado actualizar una parte de sus datos no implementada en el servidor. Campos: ${unimplemented.join(", ")}`);
		}
	}

	res.json({
		returnCode: 1
	});
});

const noOpFunction:RequestHandler = (req, res)=> {
	const response = {
		"returnCode":1,
		"apiName": req.path.split("/").pop() || "",
	};

	res.json(response);
};

// Endpoints without any operation, just return 200 OK with minimal data
const noOpEndpoints = [
	"UpsertClientTestmodeApi",
	"UpsertClientBookkeepingApi",
	"UpsertClientSettingApi",
	"RegisterPromotionCardApi",
	"UpsertClientDevelopApi",
	"UpsertClientErrorApi",
	"GameLoginApi",
	"UpsertUserGplogApi",
	"ExtendLockTimeApi",
	"GameLogoutApi",
	"GetGameMusicReleaseStateApi",
	"Ping"
].map(ep=>"/" + ep);

gekiRouter.post(noOpEndpoints, noOpFunction);

export default gekiRouter;