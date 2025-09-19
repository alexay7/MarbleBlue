import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {type Request, type RequestHandler, Router} from "express";
import {GekiUserData} from "../games/geki/models/userdata.model.ts";
import {GekiUserCard} from "../games/geki/models/usercard.model.ts";
import {GekiUserItem} from "../games/geki/models/useritem.model.ts";
import {GekiGameGacha, GekiGameGachaCard} from "../games/geki/models/gamegacha.model.ts";
import {GekiUserGacha} from "../games/geki/models/usergacha.model.ts";
import type {GekiGameGachaCardType} from "../games/geki/types/gamegacha.types.ts";
import type {
	GekiCMUpsertGachaReqType, GekiCMUpsertSelectLogType,
	GekiCMUpsertSelectReqType,
	GekiCMUpsertUserAllReqType
} from "../games/geki/types/usergacha.types.ts";
import {GekiUserCharacter} from "../games/geki/models/usercharacter.model.ts";
import {GekiUserActivity} from "../games/geki/models/useractivity.model.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/cmongeki/:ver/"
const gekiCMRouter = Router({mergeParams:true});

gekiCMRouter.post("/CMGetUserDataApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userData = await GekiUserData.findOne({userId: req.body.userId}).lean();

	if(!userData) return res.json({});

	res.json({
		userId:req.body.userId,
		userData:{
			...userData,
			lastPlayDate: dayjs(userData.lastPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
			eventWatchedDate: dayjs(userData.eventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0"),
			firstPlayDate: dayjs(userData.firstPlayDate).format("YYYY-MM-DD HH:mm:ss.0"),
			cmEventWatchedDate: dayjs(userData.cmEventWatchedDate).format("YYYY-MM-DD HH:mm:ss.0")
		}
	});
});

gekiCMRouter.post("/CMGetUserCharacterApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userChars = await GekiUserCharacter.find({userId: req.body.userId}).sort({characterId: 1}).lean();

	res.json({
		userId:req.body.userId,
		length:userChars.length,
		nextIndex:-1,
		userCharacterList:userChars
	});
});

gekiCMRouter.post("/CMGetUserCardApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userCards = await GekiUserCard.find({userId: req.body.userId}).sort({cardId: 1}).lean();

	res.json({
		userId:req.body.userId,
		length:userCards.length,
		nextIndex:-1,
		userCardList: userCards.map(card => ({
			...card,
			kaikaDate: dayjs(card.kaikaDate).format("YYYY-MM-DD HH:mm:ss.0"),
			choKaikaDate: dayjs(card.choKaikaDate).format("YYYY-MM-DD HH:mm:ss.0"),
			created: dayjs(card.created).format("YYYY-MM-DD HH:mm:ss.0"),
		}))
	});
});

gekiCMRouter.post("/CMGetUserItemApi", async (req:Request, res) => {
	if (!req.body.userId) return res.json({});

	const kind = Math.floor(req.body.nextIndex / 10000000000);

	const userItems = await GekiUserItem.find({userId: req.body.userId}, {_id:0, userId:0, __v:0}).lean();

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

gekiCMRouter.post("/GetGameGachaApi", async (_:Request, res) => {
	const gachas = await GekiGameGacha.find({}, {_id:0}).lean();

	res.json({
		length:gachas.length,
		gameGachaList:gachas.map(gacha => ({
			...gacha,
			changeRateCnt1:0,
			changeRateCnt2:0,
			startDate: dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss.0"),
			endDate: dayjs("2099-01-01").format("YYYY-MM-DD HH:mm:ss.0"),
			noticeStartDate: dayjs("2020-01-01").format("YYYY-MM-DD HH:mm:ss.0"),
			noticeEndDate: dayjs("2099-01-01").format("YYYY-MM-DD HH:mm:ss.0"),
			convertEndDate: dayjs("2099-01-01").format("YYYY-MM-DD HH:mm:ss.0"),
		})),
		registIdList:[]
	});
});

gekiCMRouter.post("/GetGameGachaCardByIdApi", async (req:Request, res) => {
	if(!req.body.gachaId) return res.json({length:0, gameGachaCardList:[]});

	const gachaCards = await GekiGameGachaCard.find({gachaId: req.body.gachaId}, {_id:0}).lean();

	const isPickup = gachaCards.some(card => card.isPickup);

	res.json({
		length:gachaCards.length,
		gameGachaCardList:gachaCards,
		isPickup,
		emissionList:[],
		afterCalcList:[]
	});
});

gekiCMRouter.post("/GetUserGachaApi", async (req:Request, res) => {
	if(!req.body.userId) return res.json({});

	const userGachas = await GekiUserGacha.find({userId: req.body.userId}, {_id:0}).lean();

	res.json({
		userId:req.body.userId,
		length:userGachas.length,
		nextIndex:-1,
		userGachaList:userGachas
	});
});

gekiCMRouter.post("/RollGachaApi", async (req:Request, res) => {
	if(!req.body.userId || !req.body.gachaId || !req.body.times) return res.json({});

	const {userId, gachaId} = req.body;
	let {times} = req.body;

	const foundGacha = await GekiGameGacha.findOne({gachaId}).lean();
	const foundUserGacha = await GekiUserGacha.findOne({userId, gachaId}).lean();

	if(!foundGacha) return res.json({});

	const odds = [76, 21, 3]; // 1,2,3 rarity
	const results:number[] = [];

	// Si es la primera vez que el usuario tira una de 5 o está tirando una de 11, darle un SR garantizado
	if ((!!foundUserGacha && foundUserGacha.fiveGachaCnt===0 && times===5)||times===11) {
		results.push(3);
		times--;
	}

	for (let i=0; i<times; i++) {
		const roll = Math.random() * 100;
		if (roll < odds[2]!) results.push(4);
		else if (roll < odds[1]! + odds[2]!) results.push(3);
		else results.push(2);
	}

	const pullableCards = await Promise.all(results.map(async () => {
		// Usar las cartas del propio gacha y las permanentes
		return GekiGameGachaCard.find({ $or: [ { rarity: {$lte:3} }, { gachaId } ] }).lean();
	}));

	const flatCards = pullableCards.flat().filter(c=>c) as GekiGameGachaCardType[];

	if(flatCards.length===0) return res.json({});

	const chosenCards = [];
	for (let i=0; i<results.length; i++) {
		const possibleCards = flatCards.filter(c=>c.rarity===results[i]);
		if(possibleCards.length===0) continue;
		const chosen = possibleCards[Math.floor(Math.random()*possibleCards.length)];
		chosenCards.push(chosen);
	}

	res.json({
		length:chosenCards.length,
		gameGachaCardList:chosenCards,
	});
});

gekiCMRouter.post("/CMUpsertUserGachaApi", async (req:Request<unknown, unknown, {
    userId:string,
    gachaId:number,
    gachaCnt:number,
    selectPoint:number,
    cmUpsertUserGacha:GekiCMUpsertGachaReqType
}>, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const {userId, gachaId, gachaCnt, selectPoint, cmUpsertUserGacha} = req.body;

	const foundUserGacha = await GekiUserGacha.findOneAndUpdate({userId, gachaId}, {
		$inc:{
			selectPoint,
			ceilingGachaCnt:selectPoint>0 ? gachaCnt : 0,
			fiveGachaCnt:gachaCnt===5 ? 1 : 0,
			elevenGachaCnt:gachaCnt===11 ? 1 : 0,
			totalGachaCnt:gachaCnt
		}
	}, {new:true, upsert:true});

	// Check user gacha date
	if (foundUserGacha) {
		const today = dayjs().tz("Asia/Tokyo").startOf("day");
		const lastGachaDate = dayjs(foundUserGacha.dailyGachaDate).tz("Asia/Tokyo").startOf("day");

		if (!lastGachaDate.isSame(today)) {
			await GekiUserGacha.findOneAndUpdate({userId, gachaId}, {
				dailyGachaCnt: 1,
				dailyGachaDate: today.toDate()
			});
		} else {
			await GekiUserGacha.findOneAndUpdate({userId, gachaId}, {
				$inc: {dailyGachaCnt: 1}
			});
		}
	}

	if (cmUpsertUserGacha.userData && cmUpsertUserGacha.userData.length>0) {
		const newUserData = cmUpsertUserGacha.userData[0]!;

		await GekiUserData.findOneAndUpdate({userId: userId, version}, {cmEventWatchedDate:dayjs(newUserData.lastPlayDate).toDate()}, {upsert: true});
	}

	if (cmUpsertUserGacha.userCharacterList && cmUpsertUserGacha.userCharacterList.length>0) {
		const bulkOps = cmUpsertUserGacha.userCharacterList.map(char => {
			char.userId = userId;
			return {
				updateOne: {
					filter: { userId: userId, characterId: char.characterId },
					update: { $set: char },
					upsert: true
				}
			};
		});

		await GekiUserCharacter.bulkWrite(bulkOps);
	}

	if (cmUpsertUserGacha.userItemList && cmUpsertUserGacha.userItemList.length>0) {
		const bulkOps = cmUpsertUserGacha.userItemList.map(item => {
			item.userId = userId;
			return {
				updateOne: {
					filter: { userId: userId, itemId: item.itemId },
					update: { $set: item },
					upsert: true
				}
			};
		});

		await GekiUserItem.bulkWrite(bulkOps);
	}

	if (cmUpsertUserGacha.userCardList && cmUpsertUserGacha.userCardList.length>0) {
		const bulkOps = cmUpsertUserGacha.userCardList.map(card => {
			card.userId = userId;
			card.kaikaDate = dayjs(card.kaikaDate).toDate();
			card.choKaikaDate = dayjs(card.choKaikaDate).toDate();
			card.created = dayjs(card.created).toDate();
			return {
				updateOne: {
					filter: { userId: userId, cardId: card.cardId },
					update: { $set: card },
					upsert: true
				}
			};
		});

		await GekiUserCard.bulkWrite(bulkOps);
	}

	res.json({
		returnCode: 1,
	});
});

gekiCMRouter.post("/CMUpsertUserAllApi", async (req:Request<unknown, unknown, {
    userId:string,
    cmUpsertUserAll:GekiCMUpsertUserAllReqType,
}>, res) => {
	if(!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const {userId, cmUpsertUserAll} = req.body;

	if (cmUpsertUserAll.userData && cmUpsertUserAll.userData.length>0) {
		const newUserData = cmUpsertUserAll.userData[0]!;

		await GekiUserData.findOneAndUpdate({userId: userId, version}, {cmEventWatchedDate:dayjs(newUserData.lastPlayDate).toDate()}, {upsert: true});
	}

	if (cmUpsertUserAll.userActivity && cmUpsertUserAll.userActivity.length>0) {
		const bulkOps = cmUpsertUserAll.userActivity.map(activity => {
			activity.userId = userId;
			return {
				updateOne: {
					filter: { userId: userId, activityId: activity.id, kind:activity.kind },
					update: { $set: activity },
					upsert: true
				}
			};
		});

		await GekiUserActivity.bulkWrite(bulkOps);
	}

	if (cmUpsertUserAll.userCharacterList && cmUpsertUserAll.userCharacterList.length>0) {
		const bulkOps = cmUpsertUserAll.userCharacterList.map(char => {
			char.userId = userId;
			return {
				updateOne: {
					filter: {userId: userId, characterId: char.characterId},
					update: {$set: char},
					upsert: true
				}
			};
		});

		await GekiUserCharacter.bulkWrite(bulkOps);
	}

	if (cmUpsertUserAll.userItemList && cmUpsertUserAll.userItemList.length>0) {
		const bulkOps = cmUpsertUserAll.userItemList.map(item => {
			item.userId = userId;
			return {
				updateOne: {
					filter: {userId: userId, itemId: item.itemId},
					update: {$set: item},
					upsert: true
				}
			};
		});

		await GekiUserItem.bulkWrite(bulkOps);
	}

	if (cmUpsertUserAll.userCardList && cmUpsertUserAll.userCardList.length>0) {
		const bulkOps = cmUpsertUserAll.userCardList.map(card => {
			card.userId = userId;
			card.kaikaDate = dayjs(card.kaikaDate).toDate();
			card.choKaikaDate = dayjs(card.choKaikaDate).toDate();
			card.created = dayjs(card.created).toDate();
			return {
				updateOne: {
					filter: {userId: userId, cardId: card.cardId},
					update: {$set: card},
					upsert: true
				}
			};
		});

		await GekiUserCard.bulkWrite(bulkOps);
	}

	res.json({
		returnCode: 1,
	});
});

gekiCMRouter.post("/CMUpsertUserSelectGachaApi", async (req:Request<unknown, unknown, {
    userId:string,
    cmUpsertUserSelectGacha:GekiCMUpsertSelectReqType,
    selectGachaLogList:GekiCMUpsertSelectLogType[]
}>, res) => {
	if (!req.body.userId) return res.json({});

	const version = parseInt(req.headers["gameVersion"] as string) || 0;

	const {userId, cmUpsertUserSelectGacha, selectGachaLogList} = req.body;

	if (cmUpsertUserSelectGacha.userData && cmUpsertUserSelectGacha.userData.length>0) {
		const newUserData = cmUpsertUserSelectGacha.userData[0]!;

		await GekiUserData.findOneAndUpdate({userId: userId, version}, {cmEventWatchedDate:dayjs(newUserData.lastPlayDate).toDate()}, {upsert: true});
	}

	if (selectGachaLogList && selectGachaLogList.length>0) {
		const selectInfo = selectGachaLogList[0]!;

		await GekiUserGacha.findOneAndUpdate({userId, gachaId: selectInfo.gachaId}, {
			selectPoint:0,
			useSelectPoint:1
		});
	}

	if (cmUpsertUserSelectGacha.userCharacterList && cmUpsertUserSelectGacha.userCharacterList.length>0) {
		const bulkOps = cmUpsertUserSelectGacha.userCharacterList.map(char => {
			char.userId = userId;
			return {
				updateOne: {
					filter: {userId: userId, characterId: char.characterId},
					update: {$set: char},
					upsert: true
				}
			};
		});

		await GekiUserCharacter.bulkWrite(bulkOps);
	}

	if (cmUpsertUserSelectGacha.userCardList && cmUpsertUserSelectGacha.userCardList.length>0) {
		const bulkOps = cmUpsertUserSelectGacha.userCardList.map(card => {
			card.userId = userId;
			card.kaikaDate = dayjs(card.kaikaDate).toDate();
			card.choKaikaDate = dayjs(card.choKaikaDate).toDate();
			card.created = dayjs(card.created).toDate();
			return {
				updateOne: {
					filter: {userId: userId, cardId: card.cardId},
					update: {$set: card},
					upsert: true
				}
			};
		});

		await GekiUserCard.bulkWrite(bulkOps);
	}

	res.json({
		returnCode: 1,
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
	"PrinterLoginApi",
	"PrinterLogoutApi",
	"CMUpsertUserPrintPlaylogApi",
	"CMUpsertUserPrintApi",
	"CMUpsertUserPrintlogApi",
	"CMGetUserGachaSupplyApi",
	"GetGameTheaterApi",
	"Ping"
].map(ep=>"/" + ep);

gekiCMRouter.post(noOpEndpoints, noOpFunction);

export default gekiCMRouter;