import { Elysia } from "elysia";
import {config} from "../config/config.ts";
import {decodeAllNet, toUrl} from "../utils/allnet.ts";
import { log } from "../utils/general.ts";
import { Keychip } from "../games/common/models/keychip.model.ts";
import z from "zod";

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
		return `${baseAddress}/mai2/${ver}/`;
	case "SDGB":
		return `${baseAddress}/mai2/${ver}/`;
	case "SDEZ":
		return `${baseAddress}/mai2/${ver}/`;
	case "SDED":
		return `${baseAddress}/card/`;
	default:
		return `${baseAddress}`;
	}
}

const allnetRouter = new Elysia()
	.onParse(async({request}) => {
		const body = await request.text() as unknown as Buffer;
		return decodeAllNet(body);
	})
	.post("/servlet/PowerOn", async ({body, set}) => {
		const here = config.ALLNET_HOST;

		log("allnet", `>>> ${JSON.stringify(body)}`);

		const keychip = body["serial"] || "";

		const foundKeychip = await Keychip.findOneAndUpdate({serial: keychip}, {
			lastLoginDate: new Date()
		});

		if(!foundKeychip && config.KEYCHIP_AUTH){
			log("allnet", `Keychip not found: ${keychip}`);

			set.headers["content-type"] = "text/plain";
			return "";
		}

		const gameId = body["game_id"] || "";
		const ver = body["ver"] || "1.0";
		const formatVer = body["format_ver"] || "";

		const respMap: Record<string, string> = {
			"uri": getGameUri(here, "80", gameId, ver, body["session"] || ""),
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
			respMap["token"] = body["token"] || "";
		}

		const respBody = toUrl(respMap) + "\n";
		log("allnet", `<<< ${JSON.stringify(respMap)}`);

		set.headers["content-type"] = "text/plain";
		return respBody;
	}, {
		body: z.object({
			serial: z.string(),
			game_id: z.string(),
			ver: z.string(),
			format_ver: z.string().optional(),
			session: z.string().optional(),
			token: z.string().optional()
		})
	})
	.post("/servlet/DownloadOrder", async ({body, set}) => {
		log("allnet", `>>> ${JSON.stringify(body)}`);

		const respMap: Record<string, string> = {
			"stat": "1",
			"serial": body["serial"] || "A69E01A7777"
		};

		const respBody = toUrl(respMap) + "\n";
		log("allnet", `<<< ${JSON.stringify(respMap)}`);

		set.headers["content-type"] = "text/plain";
		return respBody;
	}, {
		body: z.object({
			serial: z.string()
		})
	});


export default allnetRouter;