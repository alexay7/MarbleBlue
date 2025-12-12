import {Router, type RequestHandler, type Request} from "express";
import type {Chu3UpsertUserAllRequest} from "../games/chu3/types/userdata.types.ts";
import {Chu3UserData} from "../games/chu3/models/userdata.model.ts";
import {Chu3UserGameOption} from "../games/chu3/models/usergameoption.model.ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {Chu3UserCharacter} from "../games/chu3/models/usercharacter.model.ts";
import {Chu3UserItem} from "../games/chu3/models/useritem.model.ts";
import {Chu3UserMusicDetail} from "../games/chu3/models/usermusicdetail.model.ts";
import type {Chu3UserMusicDetailType} from "../games/chu3/types/usermusicdetail.types.ts";
import {Chu3UserActivity} from "../games/chu3/models/useractivity.model.ts";
import {Chu3UserMisc} from "../games/chu3/models/usermisc.model.ts";
import {Chu3UserPlaylog} from "../games/chu3/models/userplaylog.model.ts";
import {Chu3UserTeam} from "../games/chu3/models/userteam.model.ts";
import {calculateTeamEmblem, chu3ToUtf8} from "../utils/chu3.ts";
import type {Chu3TeamType, Chu3UserTeamType} from "../games/chu3/types/team.types.ts";
import {Chu3UserMapArea} from "../games/chu3/models/usermaparea.model.ts";
import {log} from "../utils/general.ts";
import {Chu3UserCmission, Chu3UserCmissionProgress} from "../games/chu3/models/usercmission.model.ts";
import {Chu3UserCourse} from "../games/chu3/models/usercourse.model.ts";
import {Chu3UserRegion} from "../games/chu3/models/userregion.model.ts";
import {config} from "../config/config.ts";
import {Chu3GameUC} from "../games/chu3/models/gameUC.model.ts";
import {Chu3UserUC} from "../games/chu3/models/useruc.model.ts";
import type {Chu3UserMusicFavoriteType} from "../games/chu3/types/usermisc.types.ts";
import {getChuniPBs} from "../utils/kt.ts";
import {Chu3UserNetBattleData, Chu3UserNetBattleLog} from "../games/chu3/models/usernetbattle.model.ts";
import {Chu3GameEvent} from "../games/chu3/models/gameevent.model.ts";
import {Chu3GameLoginBonus} from "../games/chu3/models/gameloginbonus.model.ts";
import {Chu3UserLoginBonus} from "../games/chu3/models/userloginbonus.model.ts";
import {Chu3GameMapConditions} from "../games/chu3/models/gamemapconditions.model.ts";
import {CHU3VERSIONS} from "../games/chu3/config.ts";
import {Chu3GameCharge} from "../games/chu3/models/gamecharge.model.ts";
import {Chu3UserLV} from "../games/chu3/models/userLV.model.ts";
import {deleteRedisKey} from "../modules/redis.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/chu3/:ver/"
const chu3Router = Router({mergeParams: true});

const noOpFunction: RequestHandler = (req, res) => {
	const response = {
		"returnCode": 1,
		"apiName": req.path.split("/").pop() || "",
	};

	res.json(response);
};

chu3Router.post("/ChuniServlet/GetGameSettingApi", (req: Request, res) => {
	const version = req.params.ver!;

	const now = dayjs().tz("Asia/Tokyo");

	const jstRebootStatTime = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
	const jstRebootEndTime = now.subtract(3, "hour").format("YYYY-MM-DD HH:mm:ss");

	// Today at 00:00 JST
	const jstMatchStartTime = now.startOf("day").format("YYYY-MM-DD HH:mm:ss");
	// Today at 23:59 JST
	const jstMatchEndTime = now.endOf("day").format("YYYY-MM-DD HH:mm:ss");

	const versionIndex = req.headers["gameVersion"] as string;

	const lastDataVersion = CHU3VERSIONS.find(v => v.index === parseInt(versionIndex))?.data;

	res.json({
		"gameSetting": {
			"romVersion": `${version}.00`,
			"dataVersion": lastDataVersion,
			"isMaintenance": false,
			"requestInterval": 0,
			"rebootStartTime": jstRebootStatTime,
			"rebootEndTime": jstRebootEndTime,
			"isBackgroundDistribute": false,
			"maxCountCharacter": 300,
			"maxCountItem": 300,
			"maxCountMusic": 300,
			"matchStartTime": jstMatchStartTime,
			"matchEndTime": jstMatchEndTime,
			"matchTimeLimit": 10,
			"matchErrorLimit": 10,
			"matchingUri": config.DEFAULT_CHU3_MATCHING_URI,
			"matchingUriX": config.DEFAULT_CHU3_MATCHING_URI,
			"udpHolePunchUri": config.DEFAULT_CHU3_MATCHING_REFLECTOR,
			"reflectorUri": config.DEFAULT_CHU3_MATCHING_REFLECTOR
		},
		"isDumpUpload": false,
		"isAou": false
	});
});

chu3Router.post("/ChuniServlet/GetGameIdlistApi", (req: Request, res) => {
	const reqMap = req.body;
	const response = {
		"type": reqMap.type,
		"length": 0,
		"gameIdListList": []
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetGameEventApi", async (_: Request, res) => {
	const gameEvents = await Chu3GameEvent.find({enabled: true}, {name: 0, _id: 0}).lean();

	res.json({
		type: 1,
		length: gameEvents.length,
		gameEventList: gameEvents.map(ev => ({
			...ev,
			startDate: "2019-01-01 00:00:00.0",
			endDate: "2099-11-01 00:00:00.0",
		}))
	});
});

chu3Router.post("/ChuniServlet/GetGameChargeApi", async(_: Request, res) => {
	const gameCharges = await Chu3GameCharge.find({}, {_id: 0}).lean();

	const response = {
		"length": gameCharges.length,
		"gameChargeList": gameCharges.map((charge, i) => ({
			...charge,
			orderId:i,
			startDate: "2019-01-01 00:00:00.0",
			endDate: "2099-11-01 00:00:00.0",
			saleEndDate: "2099-11-01 00:00:00.0",
			saleStartDate: "2019-01-01 00:00:00.0",
		}))
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetGameMapAreaConditionApi", async (_: Request, res) => {
	const gameMapConditions = await Chu3GameMapConditions.find({}, {_id: 0, __v: 0}).lean();

	res.json({
		"gameMapAreaConditionList": gameMapConditions
	});
});

chu3Router.post("/ChuniServlet/GetGameCourseLevelApi", async (_: Request, res) => {
	const allUCCourses = await Chu3GameUC.aggregate()
		.unwind("$courses")
		.group({
			_id: "$courses.courseId",
			courseId: {$first: "$courses.courseId"},
			startDate: {$min: "$courses.startDate"},
			endDate: {$max: "$courses.endDate"},
		})
		.project({
			_id: 0,
			courseId: 1,
			startDate: {
				$dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$startDate", timezone: "Asia/Tokyo"}
			},
			endDate: {
				$dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$endDate", timezone: "Asia/Tokyo"}
			},
		})
		.sort({courseId: 1});

	const response = {
		"length": allUCCourses.length,
		"gameCourseLevelList": allUCCourses
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GameLoginApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const loginBonuses = await Chu3GameLoginBonus.find({}).lean();

	for (const bonus of loginBonuses) {
		const userBonus = await Chu3UserLoginBonus.findOneAndUpdate({
			cardId: req.body.userId,
			presetId: bonus.presetId
		}, {}, {upsert: true}).lean();

		if (!userBonus || userBonus.isFinished) continue;

		// Check if last update was before today JST
		const lastUpdate = dayjs(userBonus?.lastUpdateDate).tz("Asia/Tokyo");
		const now = dayjs().tz("Asia/Tokyo");

		if (lastUpdate.isAfter(now.startOf("day"))) continue;

		const presetBonuses = await Chu3GameLoginBonus.find({presetId: bonus.presetId}).sort({needLoginDayCount:-1}).lean();

		if (!presetBonuses.length) continue;

		let bonusDays = userBonus.bonusCount + 1;
		let isFinished = false;

		if (bonusDays > presetBonuses[0]!.needLoginDayCount) {
			// Loop events with id under 3000
			if (bonus.presetId < 3000) {
				bonusDays = 1;
			} else {
				isFinished = true;
			}
		}

		const todayBonus = presetBonuses.find(b => b.needLoginDayCount === bonusDays);

		// Update user login bonus
		await Chu3UserLoginBonus.findOneAndUpdate(
			{cardId: req.body.userId, presetId: bonus.presetId},
			{
				$set: {
					lastUpdateDate: dayjs().toDate(),
					isWatched: false,
					isFinished: isFinished,
					bonusCount: bonusDays,
				}
			}
			, {upsert: true});

		if (!todayBonus) continue;

		console.log(todayBonus);

		// Add item to user inventory
		await Chu3UserItem.findOneAndUpdate(
			{cardId: req.body.userId, itemId: todayBonus.presentId, itemKind: 6},
			{$inc: {stock: todayBonus.itemNum}},
			{upsert: true, new: true}
		).lean();
	}

	return res.json({
		"returnCode": 1,
	});
});

chu3Router.post("/ChuniServlet/GetGameUCConditionApi", async (_: Request, res) => {
	const allUCs = await Chu3GameUC.aggregate().match({unlockChallengeId:{$exists:true}})
		.project({
			_id: 0,
			unlockChallengeId: 1,
			length: {$size: "$conditionList"},
			conditionList: {
				$map: {
					input: "$conditionList",
					as: "cond",
					in: {
						type: "$$cond.type",
						conditionId: "$$cond.conditionId",
						logicalOpe: "$$cond.logicalOpe",
						startDate: {
							$dateToString: {
								format: "%Y-%m-%d %H:%M:%S",
								date: "$$cond.startDate",
								timezone: "Asia/Tokyo"
							}
						},
						endDate: {
							$dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$$cond.endDate", timezone: "Asia/Tokyo"}
						},
					}
				}
			}
		})
		.sort({unlockChallengeId: 1});

	const response = {
		"length": allUCs.length,
		"gameUnlockChallengeConditionList": allUCs
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetGameLVConditionOpenApi", (_: Request, res) => {
	// LINKED VERSE
	const response = {
		"length": 1,
		"gameLinkedVerseConditionOpenList": [
			{
				linkedVerseId: 10001,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			},
			{
				linkedVerseId: 10002,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10003,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10004,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10005,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10006,
				length: 1,
				conditionList: [{

					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}
		]
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetGameLVConditionUnlockApi", (_: Request, res) => {
	// LINKED VERSE
	const response = {
		"length": 5,
		"gameLinkedVerseConditionUnlockList": [
			{
				linkedVerseId: 10001,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			},
			{
				linkedVerseId: 10002,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10003,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10004,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10005,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}, {
				linkedVerseId: 10006,
				length: 1,
				conditionList: [{
					type: 3,
					conditionId:0,
					logicalOpe: 1,
					startDate: "2019-01-01 00:00:00",
					endDate: "2099-11-01 00:00:00",
				}
				]
			}
		]
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetUserPreviewApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await Chu3UserData.findOne({cardId: req.body.userId, version: {$lte: version}}, {
		userName: 1,
		reincarnationNum: 1,
		level: 1,
		exp: 1,
		playerRating: 1,
		lastGameId: 1,
		lastRomVersion: 1,
		lastDataVersion: 1,
		lastPlayDate: 1,
		classEmblemBase: 1,
		classEmblemMedal: 1,
		battleRankId: 1,
		trophyId: 1,
		nameplateId: 1,
		characterId: 1,
	}).sort({version: -1}).lean();

	if (!foundUserData) return res.json({});

	const foundCharacter = await Chu3UserCharacter.findOne({
		cardId: req.body.userId,
		characterId: foundUserData.characterId
	}).lean();

	const foundUserOption = await Chu3UserGameOption.findOne({cardId: req.body.userId}, {
		playerLevel: 1,
		rating: 1,
		headphone: 1,
	}).lean() || {};

	const response = {
		userId: req.body.userId,
		isLogin: false,
		...foundUserData,
		lastLoginDate: dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
		lastPlayDate: dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
		userCharacter: foundCharacter || {},
		...foundUserOption,
		chargeState: 1,
		userNameEx: ""
	};

	res.json(response);
});

chu3Router.post("/ChuniServlet/GetUserDataApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const foundUserData = await Chu3UserData.findOne({
		cardId: req.body.userId,
		version: {$lte: version}
	}).sort({version: -1}).lean();

	if (!foundUserData) return res.json({});

	res.json({
		"userId": req.body.userId,
		"userData": {
			...foundUserData,
			lastPlayDate: dayjs(foundUserData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
			eventWatchedDate: dayjs(foundUserData.eventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0"),
			firstPlayDate: dayjs(foundUserData.firstPlayDate).format("YYYY-MM-DD HH:mm:ss.0")
		}
	});
});

chu3Router.post("/ChuniServlet/GetUserOptionApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUserOption = await Chu3UserGameOption.findOne({cardId: req.body.userId}).lean();

	if (!foundUserOption) return res.json({});

	res.json({
		userId: req.body.userId,
		userGameOption: foundUserOption
	});
});

chu3Router.post("/ChuniServlet/GetUserCharacterApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	let nextIndex = parseInt(req.body.nextIndex) || 0;
	const limit = parseInt(req.body.maxCount) || 300;

	const userCharacters = await Chu3UserCharacter.find({cardId: req.body.userId}, {
		_id: 0,
		cardId: 0,
		__v: 0
	}).skip(nextIndex).limit(limit + 1).lean();

	if (!userCharacters) return res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userCharacterList: []
	});

	nextIndex = userCharacters.length > limit ? nextIndex + limit : -1;

	res.json({
		userId: req.body.userId,
		length: userCharacters.length,
		nextIndex: nextIndex,
		userCharacterList: userCharacters
	});
});

chu3Router.post("/ChuniServlet/GetUserActivityApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = req.body.kind || 0;

	const userActivity = await Chu3UserActivity.find({cardId: req.body.userId, kind: parseInt(kind)}, {
		_id: 0,
		cardId: 0,
		__v: 0
	}).sort({_id:-1}).lean();

	if (!userActivity.length) return res.json({
		userId: req.body.userId,
		length: 0,
		kind: parseInt(kind),
		userActivityList: []
	});

	res.json({
		userId: req.body.userId,
		length: userActivity.length,
		kind: parseInt(kind),
		userActivityList: userActivity
	});
});

chu3Router.post("/ChuniServlet/GetUserItemApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const limit = parseInt(req.body.maxCount) || 300;
	const kind = Math.floor(req.body.nextIndex / 10000000000);
	let nextIndex = parseInt(req.body.nextIndex) % 10000000000 || 0;

	const userItems = await Chu3UserItem.find({cardId: req.body.userId, itemKind: kind}, {
		_id: 0,
		cardId: 0,
		__v: 0
	}).skip(nextIndex).limit(limit + 1).lean();

	if (!userItems) return res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userItemList: []
	});

	nextIndex = userItems.length > limit ? kind * 10000000000 + (nextIndex + limit)
		: -1;

	res.json({
		userId: req.body.userId,
		length: userItems.length,
		itemKind: kind,
		nextIndex: nextIndex,
		userItemList: userItems
	});
});

chu3Router.post("/ChuniServlet/GetUserRecentRatingApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		length: 0,
		userRecentRatingList: userMisc?.recentRatingList || []
	});
});

chu3Router.post("/ChuniServlet/GetUserMusicApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const limit = parseInt(req.body.maxCount) || 300;
	let nextIndex = parseInt(req.body.nextIndex) || 0;

	const userMusicDetails = await Chu3UserMusicDetail.aggregate<{
        _id: number;
        musicDetails: Chu3UserMusicDetailType[];
    }>()
		.match({cardId: req.body.userId})
		.group({
			_id: "$musicId",
			musicDetails: {$addToSet: "$$ROOT"}
		})
		.sort({_id: 1})
		.skip(nextIndex)
		.limit(limit + 1);

	if (!userMusicDetails) return res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userMusicList: []
	});

	const musicDetails = userMusicDetails.map(music => {
		return {
			length: music.musicDetails.length,
			userMusicDetailList: music.musicDetails
		};
	}).slice(0, limit);

	nextIndex = userMusicDetails.length > limit ? nextIndex + limit : -1;

	res.json({
		userId: req.body.userId,
		length: musicDetails.length,
		nextIndex: nextIndex,
		userMusicList: musicDetails
	});
});

chu3Router.post("/ChuniServlet/GetUserRegionApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUserRegions = await Chu3UserRegion.find({cardId: req.body.userId}).lean();

	res.json({
		userId: req.body.userId,
		userRegionList: foundUserRegions
	});
});

chu3Router.post("/ChuniServlet/GetUserChargeApi", (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 1,
		userChargeList: req.body.userId === "3144424170" ? [{
			chargeId: 2060,
			stock: 1,
			purchaseDate: "2019-01-01 00:00:00.0",
			validDate: dayjs().format("YYYY-MM-DD HH:mm:ss.0"),
			param1: 0,
			param2: 0,
			paramDate: dayjs().format("YYYY-MM-DD HH:mm:ss.0"),
		}]:[]
	});
});

chu3Router.post("/ChuniServlet/GetUserCourseApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const limit = parseInt(req.body.maxCount) || 50;
	let nextIndex = parseInt(req.body.nextIndex) || 0;

	const foundUserCourses = await Chu3UserCourse.find({cardId: req.body.userId}).skip(nextIndex).limit(limit + 1).lean();

	if (!foundUserCourses) return res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userCourseList: []
	});

	nextIndex = foundUserCourses.length > limit ? nextIndex + limit : -1;

	res.json({
		userId: req.body.userId,
		length: foundUserCourses.length,
		nextIndex: nextIndex,
		userCourseList: foundUserCourses
	});
});

chu3Router.post("/ChuniServlet/GetUserCMissionListApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const missionsToSearch = ((req.body.userCMissionList || []) as {
        missionId: string
    }[]).map(m => parseInt(m.missionId));

	const foundMissions = await Chu3UserCmission.aggregate()
		.match({cardId: req.body.userId, missionId: {$in: missionsToSearch}})
		.lookup({
			from: "chu3usercmissionprogresses",
			localField: "missionId",
			foreignField: "missionId",
			as: "userCMissionprogressList"
		});

	res.json({
		userId: req.body.userId,
		userCMissionList: foundMissions
	});
});

chu3Router.post("/ChuniServlet/GetUserFavoriteItemApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	let nextIndex = parseInt(req.body.nextIndex) || 0;
	const limit = parseInt(req.body.maxCount) || 50;
	const kind = parseInt(req.body.kind) || 0;

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	if (!userMisc) return res.json({
		userId: req.body.userId,
		length: 0,
		kind: kind,
		nextIndex: -1,
		userFavoriteItemList: []
	});

	let list: Chu3UserMusicFavoriteType[];

	switch (kind) {
	case 1: {
		list = userMisc.favoriteMusicList;
		break;
	}
	case 2: {
		list = userMisc.rivalList;
		break;
	}
	case 3: {
		list = userMisc.favoriteCharacterList;
		break;
	}
	default: {
		list = [];
		break;
	}
	}

	list = list.slice(nextIndex, nextIndex + limit);
	nextIndex = (nextIndex + limit) < userMisc.favoriteMusicList.length ? nextIndex + limit : -1;

	if (list.length === 0) nextIndex = -1;

	res.json({
		userId: req.body.userId,
		length: list.length,
		kind: req.body.kind,
		nextIndex: nextIndex,
		userFavoriteItemList: list
	});
});

chu3Router.post("/ChuniServlet/GetUserTeamApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUserTeamRes = await Chu3UserTeam.aggregate<Chu3UserTeamType & {
        teamInfo: Chu3TeamType
    }>()
		.match({cardId: req.body.userId})
		.lookup({
			from: "chu3teams",
			localField: "teamId",
			foreignField: "teamId",
			as: "teamInfo"
		})
		.unwind("$teamInfo")
		.limit(1);

	if (!foundUserTeamRes.length) return res.json({});

	const teamsRanking = await Chu3UserTeam.aggregate()
		.group({
			_id: "$teamId",
			monthlyPoints: {$sum: "$currentPoints"},
		})
		.sort({monthlyPoints: -1})
		.project({
			teamId: "$_id",
			monthlyPoints: 1,
			_id: 0
		}).limit(70);

	let [foundUserTeam] = foundUserTeamRes;
	foundUserTeam = foundUserTeam!;

	const rankingPos = teamsRanking.findIndex(t => t.teamId === foundUserTeam.teamId);

	res.json({
		userId: req.body.userId,
		teamId: foundUserTeam.teamId,
		teamRank: rankingPos === -1 ? 999999 : rankingPos + 1,
		teamName: foundUserTeam.teamInfo.teamName,
		emblemId: calculateTeamEmblem(rankingPos, foundUserTeam.teamInfo.lastMonthPoints),
		userTeamPoint: {
			userId: req.body.userId,
			teamId: foundUserTeam.teamId,
			orderId: 1,
			teamPoint: foundUserTeam.currentPoints,
			aggrDate: dayjs().format("YYYY-MM-DD HH:mm:ss.0"),
		}
	});
});

chu3Router.post("/ChuniServlet/GetTeamCourseSettingApi", (req: Request, res) => {
	// TODO
	res.json({
		"userId": req.body.userId,
		"length": 1,
		"nextIndex": -1,
		"teamCourseSettingList": [
			{
				"courseId": 200240,
				"classId": 4,
				"ruleId": 1000,
				"courseName": "チーム用コース",
				"teamCourseMusicList": [
					{"musicId": 385, "type": 0, "level": 2},
					{"musicId": 376, "type": 0, "level": 2},
					{"musicId": 411, "type": 0, "level": 2}
				],
				"teamCourseRankingInfoList": [],
				"recodeDate": "2099-12-31 11:59:99.0",
				"isPlayed": false
			}
		],
	});
});

chu3Router.post("/ChuniServlet/GetTeamCourseRuleApi", (req: Request, res) => {
	// TODO
	res.json({
		"userId": req.body.userId,
		"length": 1,
		"nextIndex": -1,
		"teamCourseRuleList": [
			{
				"ruleId": 1000,
				"recoveryLife": 0,
				"life": 100,
				"damageMiss": 1,
				"damageAttack": 1,
				"damageJustice": 0,
				"damageJusticeC": 0
			}
		],
	});
});

chu3Router.post("/ChuniServlet/GetUserLoginBonusApi", async (req: Request, res) => {
	const userLoginBonuses = await Chu3UserLoginBonus.find({cardId: req.body.userId, isFinished: false}, {
		_id: 0,
		__v: 0
	}).lean();

	if (!userLoginBonuses.length) return res.json({
		userId: req.body.userId,
		length: 0,
		userLoginBonusList: []
	});

	res.json({
		userId: req.body.userId,
		length: userLoginBonuses.length,
		userLoginBonusList: userLoginBonuses.map(lb => ({
			...lb,
			lastUpdateDate: dayjs(lb.lastUpdateDate).format("YYYY-MM-DD HH:mm:ss"),
		}))
	});
});

chu3Router.post("/ChuniServlet/GetUserMapAreaApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const mapsToSearch = ((req.body.mapAreaIdList || []) as { mapAreaId: number }[]).map(m => m.mapAreaId);

	const foundUserMapAreas = await Chu3UserMapArea.find({
		cardId: req.body.userId,
		mapAreaId: {$in: mapsToSearch}
	}).lean();

	res.json({
		userId: req.body.userId,
		length: foundUserMapAreas.length,
		userMapAreaList: foundUserMapAreas
	});
});

chu3Router.post("/ChuniServlet/GetUserSymbolChatSettingApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	if (!userMisc) return res.json({
		userId: req.body.userId,
		length: 0,
		symbolChatInfoList: []
	});

	res.json({
		userId: req.body.userId,
		length: userMisc.chatSymbols.length,
		symbolChatInfoList: userMisc.chatSymbols
	});
});

chu3Router.post("/ChuniServlet/GetUserNetBattleDataApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUser = await Chu3UserData.findOne({cardId: req.body.userId}).lean();
	const foundUserNetBattleData = await Chu3UserNetBattleData.findOne({cardId: req.body.userId}).lean();
	const foundUserNetBattleLogs = await Chu3UserNetBattleLog.find({cardId: req.body.userId}).sort({battleDate: -1}).limit(20).lean();

	if (!foundUserNetBattleData || !foundUser) return res.json({
		userId: req.body.userId,
		userNetBattleData: {},
	});

	res.json({
		userId: req.body.userId,
		userNetBattleData: {
			...foundUserNetBattleData,
			recentNBMusicList: foundUserNetBattleLogs.map(el => ({
				musicId: el.musicId,
				difficultyId: el.difficultyId,
				score: el.score,
				userName: foundUser.userName,
				memberName1: el.opponentUserName1,
				memberScore1: el.opponentScore1,
				memberName2: el.opponentUserName2,
				memberScore2: el.opponentScore2,
				memberName3: el.opponentUserName3,
				memberScore3: el.opponentScore3,
				selectedMemberNum: [
					true,
					el.selectUserId === el.opponentUserId1,
					el.selectUserId === el.opponentUserId2,
					el.selectUserId === el.opponentUserId3
				].lastIndexOf(true)
			}))
		}
	});
});

chu3Router.post("/ChuniServlet/GetUserNetBattleRankingInfoApi", (_: Request, res) => {
	// No utilizado
	res.json({
		userId: 3144480559,
		length: 0,
		userNetBattleRankingInfoList: [],
	});
});

chu3Router.post("/ChuniServlet/GetUserUCApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundUCs = await Chu3UserUC.aggregate()
		.match({cardId: req.body.userId})
		.addFields({
			clearDate: {$dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$clearDate", timezone: "Asia/Tokyo"}}
		})
		.project({_id: 0});

	res.json({
		userId: req.body.userId,
		length: foundUCs.length,
		userUnlockChallengeList: foundUCs
	});
});

chu3Router.post("/ChuniServlet/GetUserLVApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const foundLVs = await Chu3UserLV.aggregate()
		.match({cardId: req.body.userId})
		.addFields({
			clearDate: {$dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$clearDate", timezone: "Asia/Tokyo"}}
		})
		.project({_id: 0});

	res.json({
		userId: req.body.userId,
		length: foundLVs.length,
		nextIndex: -1,
		userLinkedVerseList: foundLVs,
	});
});

chu3Router.post("/ChuniServlet/GetUserRecMusicApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const popularSongs = await Chu3UserPlaylog.aggregate()
		.match({
			playDate: {
				$gte: dayjs().subtract(30, "day").toDate()
			}
		})
		.group({
			_id: {musicId: "$musicId"},
			playCount: {$sum: 1}
		})
		.sort({playCount: -1})
		.limit(25)
		.project({
			_id: 0,
			musicId: "$_id.musicId",
			playCount: 1
		});

	if (!popularSongs.length) return res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userRecMusicList: []
	});

	// Create a string with the format musicId,difficultyId;musicId,difficultyId
	const recMusicList = popularSongs.map(s => `${s.musicId},1`).join(";");

	res.json({
		userId: req.body.userId,
		length: 0,
		nextIndex: -1,
		userRecMusicList: [
			{
				musicId:1,
				recMusicList
			}
		]
	});
});

chu3Router.post("/ChuniServlet/GetUserRecRatingApi", async (req: Request, res) => {
	// Get user candidate songs
	if (!req.body.userId) return res.json({});

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	if (!userMisc||!userMisc.ratingBaseNextList) return res.json({});

	// For each song recommend a level upper of what the user already has
	const recSongs = (await Promise.all(userMisc.ratingBaseNextList.map(async m=>{
		if(m.score >= 1009000) return null;
		else if (m.score >= 1007500) return `${m.musicId},3,16000,1009000`;
		else if (m.score >= 1005000) return `${m.musicId},3,16000,1007500`;
		else if (m.score >= 1000000) return `${m.musicId},3,16000,1005000`;
		else if (m.score >= 990000) return `${m.musicId},3,16000,1000000`;
		else if (m.score >= 975000) return `${m.musicId},3,16000,990000`;
		else return `${m.musicId},${m.difficultId},16000,975000`;
	}))).filter(s=>s!==null);

	res.json({
		userId: req.body.userId,
		nextIndex: -1,
		length: 1,
		userRecRatingList: [
			{
				ratingMin: 0,
				ratingMax: 3000,
				recMusicList: recSongs.join(";")
			}
		]
	});
});

chu3Router.post("/ChuniServlet/GetUserRivalDataApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	if (!userMisc) return res.json({});

	const rivalId = req.body.rivalId || "0";

	const foundRival = userMisc.rivalList.find(r => r.id.toString() === rivalId.toString())?.ktAlias;

	if (!foundRival) return res.json({});

	res.json({
		userId: req.body.userId,
		userRivalData: {
			rivalId: rivalId,
			rivalName: foundRival
		},
	});
});

chu3Router.post("/ChuniServlet/GetUserRivalMusicApi", async (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	const userMisc = await Chu3UserMisc.findOne({cardId: req.body.userId}).lean();

	if (!userMisc) return res.json({});

	const rivalId = req.body.rivalId || "0";

	const foundRival = userMisc.rivalList.find(r => r.id.toString() === rivalId.toString())?.ktAlias;

	if (!foundRival) return res.json({});

	console.log(foundRival);

	const rivalPBs = await getChuniPBs(foundRival);

	res.json({
		userId: req.body.userId,
		rivalId: rivalId,
		length: rivalPBs.length,
		nextIndex: -1,
		userRivalMusicList: rivalPBs
	});
});

chu3Router.post("/ChuniServlet/UpsertUserAllApi", async (req: Request, res) => {
	const body: Chu3UpsertUserAllRequest = req.body;

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	if (req.body.userId === 282724812193793) {
		//     Guest account, do nothing
		return res.json({
			"returnCode": 1,
			"apiName": "UpsertUserAllApi",
		});
	}

	if (body.upsertUserAll.userData && body.upsertUserAll.userData.length > 0) {
		// clear userdata cache
		deleteRedisKey("GetUserDataApi", body.userId);
		deleteRedisKey("CMGetUserDataApi", body.userId);
		deleteRedisKey("GetUserPreviewApi", body.userId);
		deleteRedisKey("CMGetUserPreviewApi", body.userId);

		const newUserData = body.upsertUserAll.userData[0]!;

		newUserData.cardId = body.userId;
		newUserData.version = version;
		newUserData.lastPlayDate = dayjs(newUserData.lastPlayDate, "YYYY-MM-DD HH:mm:ss").toDate();
		newUserData.eventWatchedDate = dayjs(newUserData.eventWatchedDate, "YYYY-MM-DD HH:mm:ss").toDate();
		newUserData.firstPlayDate = dayjs(newUserData.firstPlayDate, "YYYY-MM-DD HH:mm:ss").toDate();

		await Chu3UserData.findOneAndReplace({cardId: body.userId, version}, newUserData, {upsert: true});
	}

	if (body.upsertUserAll.userGameOption && body.upsertUserAll.userGameOption.length > 0) {
		const newUserGameOption = body.upsertUserAll.userGameOption[0]!;

		// clear gameoption cache
		deleteRedisKey("GetUserOptionApi", body.userId);

		newUserGameOption.cardId = body.userId;

		await Chu3UserGameOption.findOneAndReplace({cardId: body.userId}, newUserGameOption, {upsert: true});
	}

	if (body.upsertUserAll.userCharacterList && body.upsertUserAll.userCharacterList.length > 0) {
		// clear userchars cache
		deleteRedisKey("GetUserCharacterApi", body.userId);
		deleteRedisKey("CMGetUserCharacterApi", body.userId);

		const bulkOps = body.upsertUserAll.userCharacterList.map(char => {
			char.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, characterId: char.characterId},
					update: {$set: char},
					upsert: true
				}
			};
		});

		await Chu3UserCharacter.bulkWrite(bulkOps);
	}

	if( body.upsertUserAll.userLoginBonusList && body.upsertUserAll.userLoginBonusList.length > 0) {

		// clear userloginbonus cache
		deleteRedisKey("GetUserLoginBonusApi", body.userId);

		const bulkOps = body.upsertUserAll.userLoginBonusList.map(bonus => {
			bonus.cardId = body.userId;
			bonus.lastUpdateDate = dayjs(bonus.lastUpdateDate, "YYYY-MM-DD HH:mm:ss").toDate();

			return {
				updateOne: {
					filter: {cardId: body.userId, presetId: bonus.presetId},
					update: {$set: bonus},
					upsert: true
				}
			};
		});

		await Chu3UserLoginBonus.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userItemList && body.upsertUserAll.userItemList.length > 0) {
		// clear useritems cache
		deleteRedisKey("GetUserItemApi", body.userId);
		deleteRedisKey("CMGetUserItemApi", body.userId);

		const bulkOps = body.upsertUserAll.userItemList.map(item => {
			item.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, itemId: item.itemId, itemKind: item.itemKind},
					update: {$set: item},
					upsert: true
				}
			};
		});

		await Chu3UserItem.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userMusicDetailList && body.upsertUserAll.userMusicDetailList.length > 0) {
		// clear musicdetails cache
		deleteRedisKey("GetUserMusicApi", body.userId);

		const bulkOps = body.upsertUserAll.userMusicDetailList.map(music => {
			music.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, musicId: music.musicId, level: music.level},
					update: {$set: music},
					upsert: true
				}
			};
		});

		await Chu3UserMusicDetail.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userActivityList && body.upsertUserAll.userActivityList.length > 0) {
		// clear activity cache
		deleteRedisKey("GetUserActivityApi", body.userId);

		const bulkOps = body.upsertUserAll.userActivityList.map(activity => {
			activity.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, kind: activity.kind, id: activity.id},
					update: {$set: activity},
					upsert: true
				}
			};
		});

		await Chu3UserActivity.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userPlaylogList && body.upsertUserAll.userPlaylogList.length > 0) {
		const bulkOps = body.upsertUserAll.userPlaylogList.map(log => {
			log.cardId = body.userId;
			log.playDate = dayjs(log.playDate, "YYYY-MM-DD HH:mm:ss").toDate();
			log.userPlayDate = dayjs(log.userPlayDate, "YYYY-MM-DD HH:mm:ss").toDate();

			return {
				insertOne: {
					document: log
				}
			};
		});

		await Chu3UserPlaylog.bulkWrite(bulkOps);

		// Añadir ppoints por las canciones jugadas (2 por canción)
		await Chu3UserData.findOneAndUpdate({cardId: body.userId}, {
			$inc: {ppoint: body.upsertUserAll.userPlaylogList.length * 2}
		});

		// Actualizar también la región del usuario
		const [firstLog] = body.upsertUserAll.userPlaylogList;
		const region = firstLog!.regionId;

		await Chu3UserRegion.findOneAndUpdate({cardId: body.userId, regionId: region}, {
			$inc: {playCount: 1},
		}, {upsert: true});
	}

	if (body.upsertUserAll.userTeamPoint && body.upsertUserAll.userTeamPoint.length > 0) {

		// clear userteam cache
		deleteRedisKey("GetUserTeamApi", body.userId);

		const newUserTeam = body.upsertUserAll.userTeamPoint[0]!;

		await Chu3UserTeam.findOneAndUpdate({cardId: body.userId, teamId: newUserTeam.teamId}, {
			currentPoints: newUserTeam.teamPoint
		});
	}

	if (body.upsertUserAll.userMapAreaList && body.upsertUserAll.userMapAreaList.length > 0) {

		// clear maparea cache
		deleteRedisKey("GetUserMapAreaApi", body.userId);

		const bulkOps = body.upsertUserAll.userMapAreaList.map(area => {
			area.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, mapAreaId: area.mapAreaId},
					update: {$set: area},
					upsert: true
				}
			};
		});

		await Chu3UserMapArea.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userCMissionList && body.upsertUserAll.userCMissionList.length > 0) {

		// clear usermissions cache
		deleteRedisKey("GetUserCMissionListApi", body.userId);

		// First process the missions
		const bulkOps = body.upsertUserAll.userCMissionList.map(mission => {
			mission.cardId = body.userId;
			return {
				updateOne: {
					filter: {cardId: body.userId, missionId: mission.missionId},
					update: {$set: mission},
					upsert: true
				}
			};
		});

		await Chu3UserCmission.bulkWrite(bulkOps);

		// Then the progress
		const progressOps = body.upsertUserAll.userCMissionList.flatMap(mission => {
			return mission.userCMissionProgressList.map(progress => {
				progress.cardId = body.userId;
				return {
					updateOne: {
						filter: {cardId: body.userId, missionId: mission.missionId, order: progress.order},
						update: {$set: progress},
						upsert: true
					}
				};
			});
		});

		await Chu3UserCmissionProgress.bulkWrite(progressOps);
	}

	if (body.upsertUserAll.userCourseList && body.upsertUserAll.userCourseList.length > 0) {

		// clear usercourses cache
		deleteRedisKey("GetUserCourseApi", body.userId);

		const bulkOps = body.upsertUserAll.userCourseList.map(course => {
			course.cardId = body.userId;
			course.lastPlayDate = dayjs(course.lastPlayDate, "YYYY-MM-DD HH:mm:ss").toDate();
			return {
				updateOne: {
					filter: {cardId: body.userId, courseId: course.courseId},
					update: {$set: course},
					upsert: true
				}
			};
		});

		await Chu3UserCourse.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userUnlockChallengeList && body.upsertUserAll.userUnlockChallengeList.length > 0) {

		// clear UC cache
		deleteRedisKey("GetUserUCApi", body.userId);

		const bulkOps = body.upsertUserAll.userUnlockChallengeList.map(uc => {
			uc.cardId = body.userId;
			uc.clearDate = dayjs(uc.clearDate, "YYYY-MM-DD HH:mm:ss").toDate();
			return {
				updateOne: {
					filter: {cardId: body.userId, unlockChallengeId: uc.unlockChallengeId},
					update: {$set: uc},
					upsert: true
				}
			};
		});

		await Chu3UserUC.bulkWrite(bulkOps);
	}

	if(body.upsertUserAll.userLinkedVerseList && body.upsertUserAll.userLinkedVerseList.length > 0) {

		// clear LV cache
		deleteRedisKey("GetUserLVApi", body.userId);

		const bulkOps = body.upsertUserAll.userLinkedVerseList.map(lv => {
			lv.cardId = body.userId;
			lv.clearDate = dayjs(lv.clearDate, "YYYY-MM-DD HH:mm:ss").toDate();
			return {
				updateOne: {
					filter: {cardId: body.userId, linkedVerseId: lv.linkedVerseId},
					update: {$set: lv},
					upsert: true
				}
			};
		});

		await Chu3UserLV.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userNetBattlelogList && body.upsertUserAll.userNetBattlelogList.length > 0) {
		const userPlaylog = body.upsertUserAll.userPlaylogList!;

		const bulkOps = body.upsertUserAll.userNetBattlelogList.map((log, i) => {
			log.musicId = userPlaylog[i]!.musicId;
			log.difficultyId = userPlaylog[i]!.level;
			log.score = userPlaylog[i]!.score;
			log.cardId = body.userId;
			log.opponentUserName1 = chu3ToUtf8(log.opponentUserName1);
			log.opponentUserName2 = chu3ToUtf8(log.opponentUserName2);
			log.opponentUserName3 = chu3ToUtf8(log.opponentUserName3);
			return {
				insertOne: {
					document: log
				}
			};
		});

		await Chu3UserNetBattleLog.bulkWrite(bulkOps);
	}

	if (body.upsertUserAll.userNetBattleData && body.upsertUserAll.userNetBattleData.length > 0) {

		deleteRedisKey("GetUserNetBattleDataApi", body.userId);

		const newNetBattleData = body.upsertUserAll.userNetBattleData[0]!;

		newNetBattleData.cardId = body.userId;

		await Chu3UserNetBattleData.findOneAndReplace({cardId: body.userId}, newNetBattleData, {upsert: true});
	}

	const implementedFields = [
		"userData",
		"userGameOption",
		"userCharacterList",
		"userItemList",
		"userMusicDetailList",
		"userActivityList",
		"userRecentRatingList",
		"userPlaylogList",
		"userTeamPoint",
		"userRatingBaseHotList",
		"userRatingBaseList",
		"userMapAreaList",
		"userFavoriteMusicList",
		"userCMissionList",
		"userCourseList",
		"userUnlockChallengeList",
		"userNetBattlelogList",
		"userNetBattleData",
		"userLoginBonusList",
		"userRatingBaseNewList",
		"userRatingBaseNextList",
		"userRatingBaseNewNextList",
		"userLinkedVerseList",
	];

	// MISC
	const recentRating = body.upsertUserAll.userRecentRatingList || [];
	const ratingHot = body.upsertUserAll.userRatingBaseHotList || [];
	const ratingBase = body.upsertUserAll.userRatingBaseList || [];
	const newRating = body.upsertUserAll.userRatingBaseNewList || [];
	const nextRating = body.upsertUserAll.userRatingBaseNextList || [];
	const nextNewRating = body.upsertUserAll.userRatingBaseNewNextList || [];
	const favoriteMusic = (body.upsertUserAll.userFavoriteMusicList || []).filter(m => m.id > -1);

	await Chu3UserMisc.findOneAndUpdate({cardId: body.userId}, {
		recentRatingList: recentRating,
		ratingBaseHotList: ratingHot,
		ratingBaseList: ratingBase,
		ratingBaseNextList: nextRating,
		ratingBaseNewList: newRating,
		favoriteMusicList: favoriteMusic,
		userRatingBaseNewNextList: nextNewRating
	}, {upsert: true});

	if (Object.keys(body.upsertUserAll).some(key => !implementedFields.includes(key) && (body.upsertUserAll)[key] && (body.upsertUserAll)[key].length > 0)) {
		const unimplemented = Object.keys(body.upsertUserAll).filter(key => !implementedFields.includes(key) && (body.upsertUserAll)[key] && (body.upsertUserAll)[key].length > 0 && !key.startsWith("is"));

		log("error", "chu3", `El usuario ${body.userId} ha intentado actualizar una parte de sus datos no implementada en el servidor. Campos: ${unimplemented.join(", ")}`);
	}

	res.json({
		returnCode: 1
	});
});

// Endpoints antiguos
chu3Router.post("/ChuniServlet/GetUserCtoCPlay", (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 0,
		userCtoCPlayList: [],
	});
});

chu3Router.post("/ChuniServlet/GetUserDuel", (req: Request, res) => {
	if (!req.body.userId) return res.json({});

	res.json({
		userId: req.body.userId,
		length: 0,
		userDuelList: [],
	});
});

// Endpoints without any operation, just return 200 OK with minimal data
const noOpEndpoints = [
	"UpsertClientBookkeepingApi",
	"UpsertClientDevelopApi",
	"UpsertClientErrorApi",
	"UpsertClientSettingApi",
	"UpsertClientTestmodeApi",
	"CreateTokenApi",
	"RemoveTokenApi",
	"UpsertClientUploadApi",
	"MatchingServer/Ping",
	"GameLogoutApi",
	"RemoveMatchingMemberApi",
	"UpsertClientPlaytimeApi",
	"UpserClientGameStartApi",
	"UpsertClientGameEndApi",
	"GetUserCtoCPlay",
	"GetUserDuel",
	"UpsertUserChargelogApi",
	"Ping",
].map(ep => "/ChuniServlet/" + ep);

chu3Router.post(noOpEndpoints, noOpFunction);

export default chu3Router;