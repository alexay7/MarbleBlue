import { Elysia } from "elysia";
import dayjs from "dayjs";
import {GekiGameEvent} from "../games/geki/models/gameevent.model.ts";
import {GekiUserData} from "../games/geki/models/userdata.model.ts";
import {GekiUserGameOption} from "../games/geki/models/usergameoption.model.ts";

const gekiRouter = new Elysia({prefix:"/ongeki/:ver"})
	.post("/GetGameSettingApi", ({params})=>{
		const version = params.ver || "1.00";

		const now = dayjs().tz("Asia/Tokyo");

		const jstRebootStatTime = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
		const jstRebootEndTime = now.subtract(3, "hour").format("YYYY-MM-DD HH:mm:ss");

		return {
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
		};
	})
	.post("/GetGameEventApi", async (ctx)=>{
		const gameEvents = await GekiGameEvent.find({active:true}).lean();

		return {
			type:1,
			length:gameEvents.length,
			gameEventList:gameEvents.map(ev=>({
				id:ev.eventId,
				type:1,
				startDate:"2020-01-01 00:00:01.0",
				endDate:"2099-01-01 05:00:00.0",
			}))
		};
	})
	.post("/GetUserPreviewApi", async ({body, headers}) => {
		if(!body.userId) body.userId = 3144424170;

		const version = parseInt(headers["gameVersion"] as string) || 1;

		const newUser = {
			userId: body.userId,
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

		const foundUserData = await GekiUserData.findOne({userId: body.userId, version:{$lte: version}}, {
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

		if(!foundUserData) return newUser;

		const foundUserOption = await GekiUserGameOption.findOne({userId: body.userId}, {
			dispPlayerLv:1,
			dispRating:1,
			dispBP:1,
			headphone:1,
			_id:0
		}).lean();

		return {
			...foundUserData,
			...foundUserOption,
			userId: body.userId,
			isLogin:false
		};
	});

export default gekiRouter;