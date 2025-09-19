import {Router} from "express";
import {decodeAllNet, toUrl} from "../helpers/allnet.ts";
import {log} from "../helpers/general.ts";
import {config} from "../config/config.ts";

const allNetRouter = Router();

function getGameUri(here:string, port:string, gameId:string, ver:string, session:string):string {
	const baseAddress = session ? `http://${here}/gs/${session}` : `http://${here}/g`;

	switch (gameId){
	case "SDHD":
		return `${baseAddress}/chu3/${ver}/`;
	case "SDGS":
		return `${baseAddress}/chu3/${ver}/`;
	case "SDDT":
		return `${baseAddress}/ongeki/${ver}/`;
	case "SDGA":
		return `${baseAddress}/mai2/`;
	case "SDGB":
		return `${baseAddress}/mai2/`;
	case "SDEZ":
		return `${baseAddress}/mai2/`;
	case "SDED":
		return `${baseAddress}/card/`;
	default:
		return `${baseAddress}`;
	}
}

allNetRouter.post("/servlet/PowerOn", (req, res) => {
	const here = req.header("AllNet-Forwarded-From") || config.ALLNET_HOST;

	const reqMap = decodeAllNet(req.body);

	log("allnet", `>>> ${JSON.stringify(reqMap)}`);

	//  TODO: Keychip auth

	const gameId = reqMap["game_id"] || "";
	const ver = reqMap["ver"] || "1.0";
	const formatVer = reqMap["format_ver"] || "";

	const respMap: Record<string, string> = {
		"uri": getGameUri(here, "80", gameId, ver, reqMap["session"] || ""),
		"host": here,
		"region0":"1",
		"stat":"1",
		"name":"",
		"place_id":"123",
		"region_name0":"W",
		"region_name1":"X",
		"region_name2":"Y",
		"region_name3":"Z",
		"country":"JPN",
		"nickname":""
	};

	const now = new Date();

	if (formatVer.startsWith("2")){
		respMap["year"] = now.getFullYear().toString();
		respMap["month"] = (now.getMonth()+1).toString();
		respMap["day"] = now.getDate().toString();
		respMap["hour"] = now.getHours().toString();
		respMap["minute"] = now.getMinutes().toString();
		respMap["second"] = now.getSeconds().toString();
		respMap["setting"] = "1";
		respMap["timezone"] = "+09:00";
		respMap["res_class"] = "PowerOnResponseV2";
	}else {
		respMap["allnet_id"] = "456";
		respMap["client_timezone"] = "+0900";
		respMap["utc_time"] = now.toISOString().replace(/.\d+Z$/g, "Z");
		respMap["setting"] = "";
		respMap["res_ver"] = "3";
		respMap["token"] = reqMap["token"] || "";
	}

	const respBody = toUrl(respMap) + "\n";
	log("allnet", `<<< ${JSON.stringify(respMap)}`);

	res.type("text/plain").send(respBody);
});

allNetRouter.post("/servlet/DownloadOrder", (req, res) => {
	const reqMap = decodeAllNet(req.body);

	log("allnet", `>>> ${JSON.stringify(reqMap)}`);

	const respMap: Record<string, string> = {
		"stat": "1",
		"serial": reqMap["serial"] || "A69E01A7777"
	};

	const respBody = toUrl(respMap) + "\n";
	log("allnet", `<<< ${JSON.stringify(respMap)}`);

	res.type("text/plain").send(respBody);
});

export default allNetRouter;