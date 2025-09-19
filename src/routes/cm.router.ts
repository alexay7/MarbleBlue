import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {type RequestHandler, Router} from "express";
import {config} from "../config/config.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/card/:ver/"
const cmRouter = Router({mergeParams:true});

cmRouter.post("/GetGameConnectApi", async (req, res) => {
	res.json({
		length:3,
		gameConnectList:[
			{
				modelKind:0,
				type:1,
				titleUri: `http://${config.ALLNET_HOST}/g/cmchu3/2.40/`,
			},
			{
				modelKind:1,
				type:1,
				titleUri: `http://${config.ALLNET_HOST}/g/cmmai2/2.40/`,
			},
			{
				modelKind:2,
				type:1,
				titleUri: `http://${config.ALLNET_HOST}/g/cmongeki/1.50/`,
			}
		]
	});
});

cmRouter.post("/GetGameSettingApi", async (_, res) => {

	const now = dayjs().tz("Asia/Tokyo");

	const jstRebootStatTime = now.subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss");
	const jstRebootEndTime = now.subtract(3, "hour").format("YYYY-MM-DD HH:mm:ss");

	res.json({
		gameSetting:{
			romVersion: "1.35.0",
			ongekiCmVersion: "1.32.0",
			chuniCmVersion: "1.30.0",
			maimaiCmVersion: "1.45.0",
			isMaintenance: false,
			requestInterval:0,
			rebootStartTime: jstRebootStatTime,
			rebootEndTime: jstRebootEndTime,
			isBackgroundDistribute:false,
			maxCountCharacter:100,
			maxCountItem:100,
			maxCountCard:100,
			watermark:false
		},
		isDumpUpload:false,
		isAou:false
	});
});

cmRouter.post("/GetClientBookkeepingApi", async (_, res) => {
	res.json({
		placeId:291,
		length:0,
		clientBookkeepingList:[]
	});
});

const noOpFunction:RequestHandler = (req, res)=> {
	const response = {
		"returnCode":1,
		"apiName": req.path.split("/").pop() || "",
	};

	res.json(response);
};

const noOpEndpoints = [
	"UpsertClientBookkeepingApi",
	"UpsertClientSettingApi"
].map(ep=>"/" + ep);

cmRouter.post(noOpEndpoints, noOpFunction);

export default cmRouter;