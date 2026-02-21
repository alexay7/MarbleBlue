import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {Router, type Response, type Request} from "express";
import {config} from "../config/config.ts";
import type {
	CardAuthPassType,
	CardGetRefIdType,
	CardInquireType, CreateUserDataType, LoadUserDataType, SaveWeeklyMusicType,
	UpsertUserDataType
} from "../games/sdvx/types/userdata.types.ts";
import {type SingleXmlVariableType, v, xmlVar} from "../games/sdvx/types/common.types.ts";
import {Card} from "../games/common/models/card.model.ts";
import {SdvxUserDataModel} from "../games/sdvx/models/userdata.model.ts";
import {customValidateRequest} from "../utils/zod.ts";
import z from "zod";
import { SdvxUserItemModel } from "../games/sdvx/models/useritem.model.ts";
import { SdvxUserWeeklyMusicModel } from "../games/sdvx/models/userweeklymusic.model.ts";
import { SdvxUserPresentModel } from "../games/sdvx/models/userpresent.model.ts";
import {SdvxUserParamModel} from "../games/sdvx/models/userparam.model.ts";
import { SdvxUserArenaModel } from "../games/sdvx/models/userarena.model.ts";
import { SdvxUserVariantGateModel } from "../games/sdvx/models/uservariantgate.model.ts";
import {SdvxUserCourseModel} from "../games/sdvx/models/usercourse.model.ts";
import type {UpsertUserPlaylogType} from "../games/sdvx/types/userplaylog.types.ts";
import {SdvxUserPlaylogModel} from "../games/sdvx/models/userplaylog.model.ts";
import {SdvxUserMusicDetailModel} from "../games/sdvx/models/usermusicdetail.model.ts";
import type {HiScoreRequestType} from "../games/sdvx/types/usermusicdetail.types.ts";
import {getSdvxPBs} from "../utils/kt.ts";
import {SdvxGameValgenModel} from "../games/sdvx/models/gamevalgen.model.ts";
import type {ValgenResult} from "../games/sdvx/types/gamevalgen.types.ts";
import type {SdvxUserItemType} from "../games/sdvx/types/useritem.types.ts";
import {SdvxPcbModel} from "../games/sdvx/models/pcb.model.ts";
import {SdvxGameArenaModel} from "../games/sdvx/models/gamearena.model.ts";
import type {SdvxPcbType} from "../games/sdvx/types/pcb.types.ts";
import { SdvxGameEventModel } from "../games/sdvx/models/gameevent.model.ts";
import {SdvxGameMusicModel} from "../games/sdvx/models/gamemusic.model.ts";
import {SdvxGameCourseModel} from "../games/sdvx/models/gamecourse.model.ts";
import {SdvxGameWeeklyMusicModel} from "../games/sdvx/models/gameweeklymusic.model.ts";
import type {LoungeRequestType, MatchMakingRequestType} from "../games/sdvx/types/match.types.ts";
import {SdvxMatchModel} from "../games/sdvx/models/match.model.ts";
import {getWeekNumber} from "../utils/sdvx.ts";
import {encode} from "../utils/card.ts";
import {generateExternalId} from "../utils/aime.ts";
import {SdvxGameApigenModel} from "../games/sdvx/models/gameapigen.model.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

// /g/sdvx/"
const sdvxRouter = Router({mergeParams: true});

type UnkownRequest = Request<unknown, Record<string, unknown>, Record<string, unknown>, {f: string, model?: string}>;

sdvxRouter.post("/",
	customValidateRequest({
		query: z.object({
			f: z.string()
		}).loose(),
		body: z.object({
			$: z.object({
				model: z.string(),
				srcid: z.string()
			}).loose()
		}).loose()
	}),
	async (req, res) => {
		const {f} = req.query;

		const pcbId = req.body.$.srcid;

		const isPlus = req.body.$.model.includes(":X:");
		const foundPcb = await SdvxPcbModel.findOne({pcbId});

		if (!foundPcb) {
			return res.json({
				error: "unregistered_pcb"
			});
		}

		switch (f) {
		case "services.get": {
			return getServices(req, res);
		}
		case "pcbtracker.alive": {
			return res.json({
				pcbtracker: {
					$: {
						ecenable: "1",
						eclimit: "0",
						expire: "1200",
						status: "0",
						limit: "0",
						time: `${Math.floor(dayjs().tz("Europe/Madrid").valueOf() / 1000)}`
					}
				}
			});
		}
		case "package.list": {
			return res.json({
				package: {
					$: {
						expire: "1200",
						status: "0"
					}
				}
			});
		}
		case "message.get": {
			return res.json({
				message: {
					$: {
						expire: "300",
						status: "0"
					}
				}
			});
		}
		case "facility.get": return getFacilityData(req, res);
		case "pcbevent.put": return noOp(req, res, "pcbevent");
		case "dlstatus.progress": return noOp(req, res, "dlstatus");
		case "game.sv6_log":
		case "game.sv7_log":
			return noOp(req, res, "game");
		case "eventlog.write": {
			return res.json({
				eventlog: {
					$: {
						status: "0"
					},
					gamesession: {
						$: {
							"__type": "s64"
						},
						"_": "9999999"
					},
					logsendflg: {
						$: {
							"__type": "s32"
						},
						"_": 1
					},
					logerrlevel: {
						$: {
							"__type": "s32"
						},
						"_": "0"
					},
					evtidnosendflg: {
						$: {
							"__type": "s32"
						},
						"_": "0"
					}
				}
			});
		}
		case "game.sv6_common":
			return getServerData(req, res, foundPcb, 6, isPlus);
		case "game.sv7_common":
			return getServerData(req, res, foundPcb, 7, isPlus);

		case "game.sv6_hiscore":
		case "game.sv7_hiscore":
			return getServerHiScores(req, res);
		case "game.sv6_shop":
		case "game.sv7_shop":
			return getShopData(req, res);
		case "game.sv6_exception":
		case "game.sv7_exception":
			return noOp(req, res, "game");

		// COMPRUEBA SI UNA TARJETA ESTÁ REGISTRADA
		case "cardmng.inquire": return checkCard(req, res);

		// REGISTRA UNA TARJETA NUEVA
		case "cardmng.getrefid": return registerCard(req, res);

		// 	COMPRUEBA LAS CREDENCIALES DE UNA TARJETA
		case "cardmng.authpass": return cardSignIn(req, res);

		case "cardmng.bindmodel": {
			return res.json({
				cardmng: {
					$: {
						status: "0",
						// @ts-expect-error TODO: primero saber que hace esta función
						dataid: req.body.cardmng.$.refid
					}
				}
			});
		}


		// REGISTRA EL NUEVO USUARIO ASOCIADO A LA TARJETA
		case "game.sv6_new":
			return createUserData(req, res, 6);
		case "game.sv7_new":
			return createUserData(req, res, 7);
		case "game.sv6_load":
			return loadUserData(req, res, 6);
		case "game.sv7_load":
			return loadUserData(req, res, 7);
		case "game.sv6_frozen":
		case "game.sv7_frozen":
			return noOp(req, res, "game");
		case "game.sv6_load_m":
			return loadUserMusic(req, res, 6, isPlus);
		case "game.sv7_load_m":
			return loadUserMusic(req, res, 7, isPlus);
		case "game.sv6_load_r":
		case "game.sv7_load_r":
			return loadUserRivals(req, res, isPlus);
		case "game.sv6_lounge":
		case "game.sv7_lounge":
			return lounge(req, res);
		case "game.sv6_play_s":
		case "game.sv7_play_s": {
			return res.json({
				game: {}
			});
		}
		case "game.sv6_play_e":
		case "game.sv7_play_e": {
			return res.json({
				game: {}
			});
		}
		case "game.sv6_entry_s":
		case "game.sv7_entry_s":
			return matchMaking(req, res);
		case "game.sv6_entry_e":
		case "game.sv7_entry_e": {
			return noOp(req, res, "game");
		}
		case "game.sv6_save":
		case "game.sv7_save":
			return saveUserData(req, res, isPlus);
		case "game.sv6_save_m":
			return saveUserPlaylog(req, res, 6, isPlus);
		case "game.sv7_save_m":
			return saveUserPlaylog(req, res, 7, isPlus);
		case "game.sv6_save_e":
			return saveWeeklyMusic(req, res, 6);
		case "game.sv7_save_e":
			return saveWeeklyMusic(req, res, 7);
		case "game.sv6_save_mega":
		case "game.sv7_save_mega":
		{
			return res.json({
				game:{}
			});
		}
		case "game.sv6_save_valgene":
		case "game.sv7_save_valgene":
			return giveValgenePrice(req, res);

		// COMPRUEBA EL BALANCE DEL USUARIO
		case "eacoin.checkin": return checkCoinBalance(req, res);

		// PAGA POR LA PARTIDA
		case "eacoin.consume": return exchangeCoin(req, res);

		// CIERRA LA SESIÓN DEL USUARIO
		case "eacoin.checkout": return noOp(req, res, "eacoin");
		}
	});

async function getServices(req: UnkownRequest, res: Response) {
	// Función que le dice al juego las urls de los servicios disponibles

	const services = ["cardmng", "facility", "message", "numbering", "package", "pcbevent", "pcbtracker", "pkglist", "posevent", "userdata", "userid", "eacoin", "local", "local2", "lobby", "lobby2", "dlstatus", "netlog", "sidmgr", "globby"];

	res.json({
		services: {
			$: {
				expire: "10800",
				method: "get",
				mode: "operation",
				status: "0",
			},
			item: [
				{
					$: {name: "ntp", url: "ntp://pool.ntp.org/"}
				},
				{
					$: {
						name: "keepalive",
						url: "http://127.0.0.1/core/keepalive?pa=127.0.0.1&ia=127.0.0.1&ga=127.0.0.1&ma=127.0.0.1&t1=2&t2=10"
					}
				},
				...services.map(service => (
					{
						$: {name: service, url: `http://${config.ALLNET_HOST}/g/sdvx`}
					}
				)),
			]
		}
	});
}

function getFacilityData(req: UnkownRequest, res: Response) {
	return res.json({
		facility:{
			$:{
				status: "0",
			},
			location:{
				id: xmlVar("EA000001", "str"),
				type: xmlVar(0, "u8"),
				country: xmlVar("JP", "str"),
				region: xmlVar("JP-13", "str"),
				name: xmlVar("ＭＡＲＢＬＥＢＬＵＥ", "str"),
				countryname: xmlVar("Japan", "str"),
				countryjname: xmlVar("日本", "str"),
				regionname: xmlVar("Japan", "str"),
				regionjname: xmlVar("日本", "str"),
				customercode: xmlVar("AXUSR", "str"),
				companycode: xmlVar("AXCPY", "str"),
				latitude: xmlVar("0", "s32"),
				longitude: xmlVar("0", "s32"),
				accuracy: xmlVar("0", "u8"),
			},
			line:{
				id: xmlVar("3", "str"),
				class: xmlVar("8", "u8"),
				upclass: xmlVar("8", "u8"),
				rtt: xmlVar("500", "u16"),
			},
			portfw:{
				globalip: xmlVar(req.header("X-Forwarded-For")||config.SERVER_IP, "ip4"),
				globalport: xmlVar("5700", "u16"),
				privateport: xmlVar("5700", "u16"),
			},
			public:{
				flag: xmlVar("0", "u8"),
				name: xmlVar("ＭＡＲＢＬＥＢＬＵＥ", "str"),
				latitude: xmlVar("0", "str"),
				longitude: xmlVar("0", "str"),
			},
			share:{
				eacoin:{
					notchamount: xmlVar("3000", "s32"),
					notchcount: xmlVar("3", "s32"),
					supplylimit: xmlVar("100000", "s32"),
				},
				eapass:{
					valid: xmlVar("365", "u16"),
				},
				url:{
					eapass: xmlVar("https://web.marbleblue.qzz.io", "str"),
					arcadefan: xmlVar("https://web.marbleblue.qzz.io", "str"),
					konaminetdx: xmlVar("https://web.marbleblue.qzz.io", "str"),
					konamiid: xmlVar("https://web.marbleblue.qzz.io", "str"),
					eagate: xmlVar("https://web.marbleblue.qzz.io", "str"),
				}
			}
		}
	});
}

function getShopData(req: UnkownRequest, res: Response) {
	const reqBody = req.body as {
		$: {
			srcid: string
			tag: string
		}
	};
	return res.json({
		$:{
			model: req.query.model,
			srcid: reqBody.$.srcid,
			tag: reqBody.$.tag,
		},
		game:{
			locid: xmlVar("ea", "str"),
			regcode: xmlVar("1", "str"),
			locname: xmlVar("ＭＡＲＢＬＥＢＬＵＥ", "str"),
			loctype: xmlVar("0", "u8"),
			cstcode: xmlVar("AXUSR", "str"),
			cpycode: xmlVar("AXCPY", "str"),
			latde: xmlVar("0", "s32"),
			londe: xmlVar("0", "s32"),
			accu: xmlVar("0", "u8"),
			linid: xmlVar("ea", "str"),
			linclass: xmlVar("0", "u8"),
			ipaddr: xmlVar((req.ip?.includes("192.168") ? config.SERVER_IP : req.headers["x-forwarded-for"] || req.socket.remoteAddress) as string, "ip4"),
			hadid: xmlVar("00010203040506070809", "str"),
			licid: xmlVar("012199999999", "str"),
			actid: xmlVar("012018008135", "str"),
			appstate: xmlVar("0", "u8"),
			c_need: xmlVar("1", "s8"),
			c_credit: xmlVar("1", "s8"),
			s_credit: xmlVar("1", "s8"),
			free_p: xmlVar("0", "bool"),
			close: xmlVar("0", "bool"),
			close_t: xmlVar("1380", "s32"),
			playc: xmlVar("0", "u32"),
			playn: xmlVar("0", "u32"),
			playe: xmlVar("0", "u32"),
			test_m: xmlVar("0", "u32"),
			service: xmlVar("0", "u32"),
			paseli: xmlVar("1", "bool"),
			update: xmlVar("0", "u32"),
			shopname: xmlVar("MarbleBlue", "str"),
			newpc: xmlVar("1", "bool"),
			s_paseli: xmlVar("573", "s32"),
			monitor: xmlVar("0", "s32"),
			romnumber: xmlVar("what", "str"),
			etc: xmlVar("what", "str"),
			setting: {
				coin_slot: xmlVar("0", "s32"),
				game_start: xmlVar("0", "s32"),
				schedule: xmlVar("0,0,0,0,0,0,0", "str"),
				reference: xmlVar("1,1,1", "str"),
				basic_rate: xmlVar("573,573,573", "str"),
				tax_rate: xmlVar("0", "s32"),
				time_service: xmlVar("0,0,0", "str"),
				service_value: xmlVar("10,10,10", "str"),
				service_limit: xmlVar("10,10,10", "str"),
				service_time: xmlVar("07:00-11:00,07:00-11:00,07:00-11:00", "str"),
				free_play: xmlVar("0", "s32"),
				free_first_play: xmlVar("0", "s32"),
				start_credits: xmlVar("1,10,10,1,10,1,1,10,1,10,10,10,10", "str"),
				valkyrie_credit: xmlVar("3", "s32"),
			},
			button_count: {
				start: xmlVar("10000", "u32"),
				bt_a: xmlVar("20000", "u32"),
				bt_b: xmlVar("30000", "u32"),
				bt_c: xmlVar("40000", "u32"),
				bt_d: xmlVar("50000", "u32"),
				fx_l: xmlVar("60000", "u32"),
				fx_r: xmlVar("70000", "u32"),
			}
		}
	});
}

async function getServerData(req: UnkownRequest, res: Response, pcbData:SdvxPcbType, version: number, plus:boolean) {
	const valGen = await SdvxGameValgenModel.find({});

	const valGenItems = valGen.reduce((acc, vg) => {
		const thisItems = [
			...vg.crew.map(c => ({valgene_id: vg.id, rarity: 5, item_type: 11, item_id: c})),
			...vg.stamp.map(b => ({valgene_id: vg.id, rarity: 20, item_type: 17, item_id: b})),
			...vg.subbg.map(f => ({valgene_id: vg.id, rarity: 15, item_type: 18, item_id: f})),
			...vg.bgm.map(h => ({valgene_id: vg.id, rarity: 10, item_type: 19, item_id: h})),
			...vg.nemsys.map(i => ({valgene_id: vg.id, rarity: 15, item_type: 20, item_id: i}))
		];

		return [...acc, ...thisItems];
	}, [] as {valgene_id: number, rarity: number, item_type: number, item_id: number}[]);

	const apiGen = await SdvxGameApigenModel.find({version}).lean();

	const apiGenItems = apiGen.reduce((acc, apigene) => {
		const thisItems = apigene.catalog?.map(item => ({
			apigene_id: apigene.id,
			rarity: item.itemType === 23 ? 1 : 0,
			item_type: item.itemType,
			item_id: item.itemId
		})) ?? [];

		return [...acc, ...thisItems];
	}, [] as {apigene_id: number, rarity: number, item_type: number, item_id: number}[]);

	const arenaSeason = await SdvxGameArenaModel.findOne({id:pcbData.arenaSeason, version});

	// 1 - server information, 3 - stamps, 6 - kac?, 17 - megamix?, 19 - complete stamps, 20 - tama, 22 - variant gate
	const gameEvents = await SdvxGameEventModel.find({version}).lean();

	const gameMusic = await SdvxGameMusicModel.find(plus?{plus:true}:{plus:{$ne:true}}).lean();

	const gameCourses = await SdvxGameCourseModel.find({version}).lean();

	const currentWeek = getWeekNumber(new Date());
	let gameWeeklyMusic = await SdvxGameWeeklyMusicModel.find({weekId:currentWeek}).lean();

	// if there is no music just grab the last element
	if (gameWeeklyMusic.length === 0) {
		gameWeeklyMusic = await SdvxGameWeeklyMusicModel.find({}).sort({weekId:-1}).limit(1).lean();
	}

	const unlockAll = pcbData.unlockMusic;

	const final = {
		game:{
			$:{ status: "0" },
			valgene:{
				info: valGen.map(vg => ({
					valgene_name: xmlVar(vg.name, "str"),
					valgene_name_english: xmlVar(vg.name, "str"),
					valgene_id: xmlVar(vg.id, "s32"),
				})),
				catalog: valGenItems.map(item => ({
					valgene_id: xmlVar(item.valgene_id, "s32"),
					rarity: xmlVar(item.rarity, "s32"),
					item_type: xmlVar(item.item_type, "s32"),
					item_id: xmlVar(item.item_id, "s32"),
				}))
			},
			apigene:{
				info: apiGen.map(api => ({
					apigene_id: xmlVar(api.id, "s32"),
					name: xmlVar(api.name, "str"),
					name_english: xmlVar(api.nameEnglish ?? api.name, "str"),
					common_rate: xmlVar(api.commonRate ?? 0, "s32"),
					uncommon_rate: xmlVar(api.uncommonRate ?? 0, "s32"),
					rare_rate: xmlVar(api.rareRate ?? 0, "s32"),
					price: xmlVar(api.price ?? 0, "s32"),
					no_duplicate: xmlVar(api.noDuplicate ?? false, "bool"),
				})),
				catalog: apiGenItems.map(item => ({
					apigene_id: xmlVar(item.apigene_id, "s32"),
					rarity: xmlVar(item.rarity, "s32"),
					item_type: xmlVar(item.item_type, "s32"),
					item_id: xmlVar(item.item_id, "s32"),
				}))
			},
			arena: {
				season:xmlVar(arenaSeason?.id, "s32"),
				rule:xmlVar(arenaSeason?.rule, "s32"),
				rank_match_target:{
					$: {
						"__type": "s32",
						"__count":"3"
					},
					_: "0 1 2"
				},
				time_start:xmlVar(new Date("2000-01-01T00:00:00Z").getTime().toString(), "u64"),
				time_end:xmlVar(new Date("2099-12-31T00:00:00Z").getTime().toString(), "u64"),
				shop_start:xmlVar(new Date("2000-01-01T00:00:00Z").getTime().toString(), "u64"),
				shop_end:xmlVar(new Date("2099-12-31T00:00:00Z").getTime().toString(), "u64"),
				is_open:xmlVar("true", "bool"),
				is_shop:xmlVar("true", "bool"),
				catalog: arenaSeason?.catalog.map(item => ({
					catalog_id: xmlVar(item.catalogId, "s32"),
					catalog_type: xmlVar(item.catalogType, "s32"),
					price: xmlVar(item.price, "s32"),
					item_type: xmlVar(item.itemType, "s32"),
					item_id: xmlVar(item.itemId, "s32"),
					param: xmlVar(item.param, "s32"),
				}))
			},
			extend: {
				info: gameEvents.map( event => ({
					extend_id: xmlVar(event.id, "u32"),
					extend_type: xmlVar(event.type, "u32"),
					param_num_1: xmlVar(event.paramNum1, "s32"),
					param_num_2: xmlVar(event.paramNum2, "s32"),
					param_num_3: xmlVar(event.paramNum3, "s32"),
					param_num_4: xmlVar(event.paramNum4, "s32"),
					param_num_5: xmlVar(event.paramNum5, "s32"),
					param_str_1: xmlVar(event.paramStr1, "str"),
					param_str_2: xmlVar(event.paramStr2, "str"),
					param_str_3: xmlVar(event.paramStr3, "str"),
					param_str_4: xmlVar(event.paramStr4, "str"),
					param_str_5: xmlVar(event.paramStr5, "str"),
				}))
			},
			music_limited:{
				info: gameMusic.map( music => ({
					music_id: xmlVar(music.id, "s32"),
					music_type: xmlVar(music.level, "u8"),
					limited: unlockAll ? xmlVar("3", "u8") : xmlVar(music.limited, "u8")
				}))
			},
			skill_course:{
				info: gameCourses.map( course => ({
					season_id: xmlVar(course.seasonId, "s32"),
					season_name: xmlVar(course.seasonName, "str"),
					season_new_flg: xmlVar(course.isNew, "bool"),
					course_type: xmlVar(course.type, "s16"),
					course_id: xmlVar(`${course.seasonId}${course.id}`, "s16"),
					course_name: xmlVar(course.name, "str"),
					skill_level: xmlVar(course.skillLevel, "s16"),
					skill_type: xmlVar(course.skillType, "s16"),
					skill_name_id: xmlVar(course.skillId, "s16"),
					matching_assist: xmlVar(course.matchingAssist, "bool"),
					clear_rate: xmlVar(course.clearRate, "s32"),
					avg_score: xmlVar(course.avgScore, "u32"),
					track: course.track.map( track => ({
						track_no: xmlVar(track.trackNo, "s16"),
						music_id: xmlVar(track.musicId, "s32"),
						music_type: xmlVar(track.level, "s8"),
					}))
				}))
			},
			weekly_music: gameWeeklyMusic.map( weekly => ({
				week_id: xmlVar("1", "s32"),
				music_id: xmlVar(weekly.musicId, "s32"),
				time_start: xmlVar("946904980", "u64"),
				time_end: xmlVar("4071128980", "u64"),
			}))
		}
	};

	const sv6FixedFlags = [
		"DEMOGAME_PLAY", "MATCHING_MODE", "MATCHING_MODE_FREE_IP", "LEVEL_LIMIT_EASING", "ACHIEVEMENT_ENABLE", "APICAGACHADRAW\t30", "TAMAADV_ENABLE", "VOLFORCE_ENABLE", "AKANAME_ENABLE", "PAUSE_ONLINEUPDATE", "CONTINUATION", "TENKAICHI_MODE", "QC_MODE", "KAC_MODE", "DISABLE_MONITOR_ID_CHECK", "FAVORITE_APPEALCARD_MAX\t200", "FAVORITE_MUSIC_MAX\t200", "STANDARD_UNLOCK_ENABLE", "APRIL_RAINBOW_LINE_ACTIVE", "KONAMI_50TH_LOGO", "PLAYERJUDGEADJ_ENABLE", "MIXID_INPUT_ENABLE", "DISP_PASELI_BANNER", "CHARACTER_IGNORE_DISABLE\\t122,123,131,139,140,143,149,160,162,163,164,167,170,174", "STAMP_IGNORE_DISABLE\\t273~312,773~820,993~1032,1245~1284,1469~1508,1585~1632,1633~1672,1737~1776,1777~1816,1897~1936", "SUBBG_IGNORE_DISABLE\\t166~185,281~346,369~381,419~438,464~482,515~552,595~616,660~673,714~727", "OMEGA_ENABLE\t1,2,3,4,5,6,7,8,9", "OMEGA_ARS_ENABLE", "HEXA_ENABLE\t1,2,3,4,5,6,7,8,9,10,11,12", "HEXA_OVERDRIVE_ENABLE\t8", "SKILL_ANALYZER_ABLE", "BLASTER_ABLE", "PREMIUM_TIME_ENABLE", "MEGAMIX_ENABLE", "ARENA_ENABLE", "ARENA_LOCAL_TO_ONLINE_ENABLE", "ARENA_ALTER_MODE_WINDOW_ENABLE", "ARENA_PASS_MATCH_WINDOW_ENABLE", "ARENA_VOTE_MODE_ENABLE", "ARENA_LOCAL_ULTIMATE_MATCH_ALWAYS", "MEGAMIX_BATTLE_MATCH_ENABLE", "DISABLED_MUSIC_IN_ARENA_ONLINE", "SINGLE_BATTLE_ENABLE", "GENERATOR_ABLE", "CREW_SELECT_ABLE", "VALGENE_ENABLE", "PLAYER_RADAR_ENABLE", "S_PUC_EFFECT_ENABLE", "FAVORITE_CREW_ENABLE", "SUPER_RANDOM_ACTIVE", "ULTIMATE_MATCH_PLAYABLE_ALWAYS", "CLOUD_LINK_ENABLE", "TAMAADV_VALGENE_BONUS_ENABLE"
	].concat(pcbData.enabledFlags || []);

	const sv7FixedFlags = sv6FixedFlags.concat(["APIPAGENE_ENABLE", "FACTORY", "APIPA_MASK_BANNER", "VALGENE_MASK_BANNER", "SKILLLEVEL_AVERAGE_SCORE_DISP_ENABLE", "BlasterStageAvailable"]);

	return res.json({
		game:{
			valgene: final.game.valgene,
			arena: final.game.arena,
			event:{
				info: (version === 6 ? sv6FixedFlags : sv7FixedFlags)
					.map(flag => ({
						event_id: xmlVar(flag, "str"),
					}),)
			},
			extend: final.game.extend,
			music_limited: final.game.music_limited,
			skill_course: final.game.skill_course,
			weekly_music: final.game.weekly_music,
			apigene: version === 7 ? final.game.apigene : {},
		}
	});
}

async function getServerHiScores(req: UnkownRequest, res: Response) {
	const requestBody = req.body as HiScoreRequestType;
	const minSongId = parseInt(v(requestBody.game.offset));
	const maxSongId = minSongId + parseInt(v(requestBody.game.limit));

	// Get the best score for every song and every type
	const bestScores = await SdvxUserMusicDetailModel.aggregate<{
		_id: {songId: number, songType: number},
		songId: number,
		songType: number,
		sdvxId: string,
		name: string,
		score: number
	}>()
		.match({
			songId: { $gte: minSongId, $lt: maxSongId }
		})
		.sort({songId: 1, songType: 1, score: -1})
		.group({
			_id: {songId: "$songId", songType: "$songType"},
			songId: {$first: "$songId"},
			songType: {$first: "$songType"},
			sdvxId: {$first: "$sdvxId"},
			name: {$first: "$name"},
			score: {$first: "$score"}
		}).exec();

	// Get the best exscore for every song and every type
	const bestExScores = await SdvxUserMusicDetailModel.aggregate<{
		_id: {songId: number, songType: number},
		songId: number,
		songType: number,
		sdvxId: string,
		name: string,
		exscore: number
	}>()
		.match({
			songId: { $gte: minSongId, $lt: maxSongId }
		})
		.sort({songId: 1, songType: 1, exscore: -1})
		.group({
			_id: {songId: "$songId", songType: "$songType"},
			songId: {$first: "$songId"},
			songType: {$first: "$songType"},
			sdvxId: {$first: "$sdvxId"},
			name: {$first: "$name"},
			exscore: {$first: "$exscore"}
		}).exec();

	const hiScores = bestScores.map(score => {
		const bestExScore = bestExScores.find(exScore => exScore.songId === score.songId && exScore.songType === score.songType);

		const result:Record<string, unknown> = {
			id: xmlVar(score.songId, "u32"),
			ty: xmlVar(score.songType, "u32"),
			// GLOBAL SCORES
			a_sq: xmlVar(score.sdvxId.padStart(8, "0"), "str"),
			a_nm: xmlVar(score.name, "str"),
			a_sc: xmlVar(score.score, "u32"),
			// LOCAL SCORES
			l_sq: xmlVar(score.sdvxId.padStart(8, "0"), "str"),
			l_nm: xmlVar(score.name, "str"),
			l_sc: xmlVar(score.score, "u32"),
		};

		if (bestExScore) {
			result.ax_sq = xmlVar(bestExScore.sdvxId.padStart(8, "0"), "str");
			result.ax_nm = xmlVar(bestExScore.name, "str");
			result.ax_sc = xmlVar(bestExScore.exscore, "u32");

			result.lx_sq = xmlVar(bestExScore.sdvxId.padStart(8, "0"), "str");
			result.lx_nm = xmlVar(bestExScore.name, "str");
			result.lx_sc = xmlVar(bestExScore.exscore, "u32");
		}

		return result;
	});

	return res.json({
		game:{
			$:{ status: "0" },
			sc:{
				d: hiScores
			}
		}
	});
}
// return send.object({
// 	sc: {
// 		d: _.map(
// 			_.groupBy(records, r => {
// 				return `${r.mid}:${r.type}`;
// 			}),
// 			r => _.maxBy(r, 'score')
// 		).map(r => ({
// 			id: K.ITEM('u32', r.mid),
// 			ty: K.ITEM('u32', r.type),
// 			a_sq: K.ITEM('str', IDToCode(profiles[r.__refid][0].id)),
// 			a_nm: K.ITEM('str', profiles[r.__refid][0].name),
// 			a_sc: K.ITEM('u32', r.score),
// 			l_sq: K.ITEM('str', IDToCode(profiles[r.__refid][0].id)),
// 			l_nm: K.ITEM('str', profiles[r.__refid][0].name),
// 			l_sc: K.ITEM('u32', r.score),
// 		})),
// 	},
// });
// };

async function registerCard(req: UnkownRequest, res: Response) {
	const cardRegister = req.body as CardGetRefIdType;

	const internalAccessCode = cardRegister.cardmng.$.cardid;
	const accessCode = encode(internalAccessCode);
	const pin = cardRegister.cardmng.$.passwd;
	const profileId = generateExternalId(accessCode);

	await Card.create({
		accessCode,
		profileId,
		extId:internalAccessCode,
		registerDate:new Date(),
		lastLoginDate:new Date(),
		status:"good",
		userId:null,
		pin,
	});

	return res.json({
		getrefid: {
			$: {
				dataid: internalAccessCode,
				refid: internalAccessCode,
			},
		}
	});
}

async function cardSignIn(req: UnkownRequest, res: Response) {
	const cardAuth = req.body as CardAuthPassType;

	const accessCode = cardAuth.cardmng.$.refid;
	const pass = cardAuth.cardmng.$.pass;

	const foundCard = await Card.findOne({extId: accessCode, pin: pass});

	return res.json({
		cardmng: {
			$: {
				status: foundCard ? "0" : "116",
			}
		}
	});
}

async function checkCard(req: UnkownRequest, res: Response) {
	const cardInquire = req.body as CardInquireType;

	const accessCode = cardInquire.cardmng.$.cardid;

	const foundCard = await Card.findOne({extId: accessCode});

	const found = !!foundCard;

	return res.json({
		cardmng: {
			$: {
				binded: found ? "1" : "0",
				dataid: accessCode,
				ecflag: "1",
				expired: "0",
				newflag: found ? "0" : "1",
				refid: accessCode,
				status: found ? "0" : "112"
			}
		}
	});
}

async function generateSdvxId(): Promise<string> {
	const allUsers = await SdvxUserDataModel.find({}).sort({sdvxId:-1});

	let exists = true;
	let sdvxId = Math.floor(10000000 + Math.random() * 90000000).toString();

	while(exists) {
		exists = allUsers.some(user => user.sdvxId === sdvxId);

		if (exists) {
			sdvxId = Math.floor(10000000 + Math.random() * 90000000).toString();
		}
	}

	return sdvxId;
}

async function createUserData(req: UnkownRequest, res: Response, version:number) {
	const userData = req.body as CreateUserDataType;

	const accessCode = v(userData.game.dataid);
	const foundCard = await Card.findOne({extId: accessCode});

	if(!foundCard) {
		return res.json({
			game: {
				$: {
					status: "116"
				},
				result: xmlVar("1", "u8")
			}
		});
	}


	const userName = v(userData.game.name);

	// Check if user data already exists for older versions
	const foundUser = await SdvxUserDataModel.findOne({cardId: foundCard.profileId}).lean();
	const {_id, ...existingUser} = foundUser || {};
	if (existingUser) {
		await SdvxUserDataModel.create({
			...existingUser,
			version,
		});

		const userParams = await SdvxUserParamModel.find({cardId: foundCard.profileId}).lean();
		for (const param of userParams) {
			const {_id, ...existingParam} = param;
			await SdvxUserParamModel.create({
				...existingParam,
				version,
			});
		}
	} else {
		await SdvxUserDataModel.create({
			cardId: foundCard.profileId,
			version,
			name: userName,
			sdvxId: await generateSdvxId(),
			eaShop: {
				blasterPassEnable: "1",
				blasterPassLimitDate: "1767003232418",
			}
		});
	}

	return res.json({
		game: {
			result: xmlVar("0", "u8"),
		}
	});
}

async function loadUserData(req: UnkownRequest, res: Response, version:number) {
	const requestBody = req.body as LoadUserDataType;

	const accessCode = v(requestBody.game.dataid);
	const foundCard = await Card.findOne({extId: accessCode});

	if(!foundCard) {
		return res.json({
			game: {
				$: {
					status: "116"
				},
				result: xmlVar("1", "u8")
			}
		});
	}

	const userData = await SdvxUserDataModel.findOne({cardId: foundCard.profileId}).sort({version:-1}).lean();
	const userItems:{type:string, id:string, param:string}[] = await SdvxUserItemModel.find({cardId: foundCard.profileId}).lean();
	const userWeeklyMusic = await SdvxUserWeeklyMusicModel.find({cardId: foundCard.profileId}).lean();
	const userPresents = await SdvxUserPresentModel.find({cardId: foundCard.profileId}).lean();
	const userParams = await SdvxUserParamModel.find({cardId: foundCard.profileId, version}).lean();
	const userArena = await SdvxUserArenaModel.findOne({cardId: foundCard.profileId})
		.sort({season:-1}).lean();
	const userVariantGate = await SdvxUserVariantGateModel.findOne({cardId: foundCard.profileId}).lean();
	const userCourses = await SdvxUserCourseModel.find({cardId: foundCard.profileId}).lean();

	if (!userData) {
		return res.json({
			game: {
				$: {
					status: "0"
				},
				result: xmlVar("1", "u8")
			}
		});
	}

	if(userData.version < version) {
		return res.json({
			game: {
				name: xmlVar(userData.name, "str"),
				result: xmlVar("2", "u8"),
			}
		});
	}

	const HIGHEST_CREW_ID = 176;
	const HIGEST_APPEAL_ID = 5553;

	if (userData.unlockCrew) {
		userItems.push({ type: "4", id: "599", param: "10" });
		for (let i = 0; i <= HIGHEST_CREW_ID; ++i) userItems.push({ type: "11", id: `${i}`, param: "15" });
	}

	if (userData.unlockAppeal) {
		for (let i = 0; i <= HIGEST_APPEAL_ID; ++i) userItems.push({ type: "1", id: `${i}`, param: "1" });
		for (let i = 0; i <= 50; ++i) userItems.push({ type: "23", id: `${i}`, param: "99" });
		for (let i = 0; i <= 200; ++i) userItems.push({ type: "24", id: `${i}`, param: "99" });
	}

	return res.json({
		game: {
			result: xmlVar("0", "u8"),
			name: xmlVar(userData.name, "str"),
			code: xmlVar(userData.sdvxId.replace(/(\d{4})(\d{4})/, "$1-$2"), "str"),
			sdvx_id: xmlVar(userData.sdvxId.replace(/(\d{4})(\d{4})/, "$1-$2"), "str"),
			gamecoin_packet: xmlVar(userData.gamecoinPacket, "u32"),
			gamecoin_block: xmlVar(userData.gamecoinBlock, "u32"),
			appeal_id: xmlVar(userData.appealId, "u16"),

			last_music_id: xmlVar(userData.lastMusicId, "s32"),
			last_music_type: xmlVar(userData.lastMusicType, "u8"),
			sort_type: xmlVar(userData.sortType, "u8"),
			headphone: xmlVar(userData.headphone, "u8"),
			blaster_energy: xmlVar(userData.blasterEnergy, "u32"),

			hispeed: xmlVar(userData.hispeed, "s32"),
			lanespeed: xmlVar(userData.lanespeed, "u32"),
			gauge_option: xmlVar(userData.gaugeOption, "u8"),
			ars_option: xmlVar(userData.arsOption, "u8"),
			notes_option: xmlVar(userData.notesOption, "u8"),
			early_late_disp: xmlVar(userData.earlyLateDisp, "u8"),
			draw_adjust: xmlVar(userData.drawAdjust, "s32"),
			eff_c_left: xmlVar(userData.effCLeft, "u8"),
			eff_c_right: xmlVar(userData.effCRight, "u8"),
			narrow_down: xmlVar(userData.narrowDown, "u8"),

			kac_id: xmlVar(userData.kacId, "str"),

			skill_level: xmlVar(userData.skillLevel, "s16"),
			skill_base_id: xmlVar(userData.skillBaseId, "s16"),
			skill_name_id: xmlVar(userData.skillNameId, "s16"),
			skill_type: xmlVar(userData.skillType, "s16"),

			play_count: xmlVar(userData.playCount, "u32"),
			day_count: xmlVar(userData.dayCount, "u32"),
			today_count: xmlVar(userData.todayCount, "u32"),
			play_chain: xmlVar(userData.playChain, "u32"),
			max_play_chain: xmlVar(userData.maxPlayChain, "u32"),
			week_count: xmlVar(userData.weekCount, "u32"),
			week_play_count: xmlVar(userData.weekPlayCount, "u32"),
			week_chain: xmlVar(userData.weekChain, "u32"),
			max_week_chain: xmlVar(userData.maxWeekChain, "u32"),

			support_team_id: xmlVar(userData.supportTeamId, "s32"),

			additional_info: userData.additionalInfo ? {
				pro_team_id: {
					$:{
						val:userData.additionalInfo.proTeamId
					}
				}
			} : "",

			ea_shop: userData.eaShop ? {
				packet_booster: xmlVar(userData.eaShop.packetBooster, "s32"),
				block_booster: xmlVar(userData.eaShop.blockBooster, "s32"),
				blaster_pass_enable: xmlVar(userData.eaShop.blasterPassEnable, "bool"),
				blaster_pass_limit_date: xmlVar(userData.eaShop.blasterPassLimitDate, "u64"),
			} : "",

			eaappli: userData.eaappli ? {
				relation: xmlVar(userData.eaappli.relation, "s8"),
			} : "",
			cloud: userData.cloud ? {
				relation: xmlVar(userData.cloud.relation, "s8"),
			} : "",
			block_no: xmlVar(userData.blockNo, "s32"),

			valgene_ticket: userData.valgeneTicket ? {
				ticket_num: xmlVar(userData.valgeneTicket.ticketNum, "s32"),
				limit_date: xmlVar(userData.valgeneTicket.limitDate, "u64"),
			} : "",

			weekly_music: userWeeklyMusic.length ?
				userWeeklyMusic.map(weekMusic => ({
					week_id: xmlVar(weekMusic.weekId, "s32"),
					music_id: xmlVar(weekMusic.musicId, "s32"),
					music_type: xmlVar(weekMusic.musicType, "s32"),
					exscore: xmlVar(weekMusic.exscore, "u32"),
					rank: xmlVar(weekMusic.rank, "s32"),
				})) : "",

			skill: userCourses ? {
				course: userCourses.map(course => ({
					ssnid: xmlVar(course.ssnid, "s16"),
					crsid: xmlVar(course.crsid, "s16"),
					st: xmlVar(course.st, "s16"),
					sc: xmlVar(course.sc, "s32"),
					ex: xmlVar(course.ex, "s32"),
					ct: xmlVar(course.ct, "s16"),
					gr: xmlVar(course.gr, "s16"),
					ar: xmlVar(course.ar, "s16"),
					cnt: xmlVar(course.cnt, "s16"),
				}))
			} : "",

			item: userItems.length ? {
				info: userItems.map(item => ({
					type: xmlVar(item.type, "u8"),
					id: xmlVar(item.id, "u32"),
					param: xmlVar(item.param, "u32"),
				}))
			} : "",

			present: userPresents.length ? {
				info: userPresents.map(present => ({
					type: xmlVar(present.type, "u8"),
					id: xmlVar(present.id, "s32"),
					param: xmlVar(present.param, "s32"),
				}))
			} : "",

			param: userParams.length ? {
				info: userParams.map(param => ({
					type: xmlVar(param.type, "s32"),
					id: xmlVar(param.id, "s32"),
					param: {
						$: {
							"__type": "s32",
							"__count":`${param.count||1}`
						},
						_: param.param
					}
				}))
			} : "",

			arena: userArena ? {
				last_play_season: xmlVar(userArena.season, "s32"),
				rank_point: xmlVar(userArena.rankPoint, "s32"),
				shop_point: xmlVar(userArena.shopPoint, "s32"),
				ultimate_rate: xmlVar(userArena.ultimateRate, "s32"),
				ultimate_rank_num: xmlVar(userArena.ultimateRankNum, "s32"),
				megamix_rate: xmlVar(userArena.megamixRate, "s32"),
				rank_play_cnt: xmlVar(userArena.rankPlayCnt, "s32"),
				ultimate_play_cnt: xmlVar(userArena.ultimatePlayCnt, "s32"),
			} : "",

			// // creator_item: userData.creatorItem ? {
			// // 	info: {
			// // 		creator_type: xmlVar(userData.creatorItem.info.creatorType, "u32"),
			// // 		item_id: xmlVar(userData.creatorItem.info.itemId, "u32"),
			// // 		param: xmlVar(userData.creatorItem.info.param, "u32"),
			// // 	}
			// // } : "",
			//
			variant_gate: userVariantGate ? {
				power: xmlVar(userVariantGate.power, "s32"),
				overRadar: {
					_: userVariantGate.overRadar || "0",
					$: {
						"__type": "s32",
					}
				},
				element: {
					notes: xmlVar(userVariantGate.element.notes, "s32"),
					peak: xmlVar(userVariantGate.element.peak, "s32"),
					tsumami: xmlVar(userVariantGate.element.tsumami, "s32"),
					tricky: xmlVar(userVariantGate.element.tricky, "s32"),
					onehand: xmlVar(userVariantGate.element.onehand, "s32"),
					handtrip: xmlVar(userVariantGate.element.handtrip, "s32"),
				}
			} : ""
		}
	});
}

async function loadUserMusic(req: UnkownRequest, res: Response, version:number, plus:boolean) {
	const requestBody = req.body as LoadUserDataType;

	const accessCode = v(requestBody.game.refid);
	const foundCard = await Card.findOne({extId: accessCode});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	const userMusicDetails = await SdvxUserMusicDetailModel.find(plus ? {cardId: foundCard.profileId, plus:true}:{cardId: foundCard.profileId, plus:{$ne:true}}).sort({version:-1}).lean();

	return res.json({
		game: {
			music: {
				info: userMusicDetails.map(musicDetail => {
					if(version===7 && musicDetail.version!==7){
						switch(musicDetail.clearType){
						case 4: musicDetail.clearType = 5; break;
						case 5: musicDetail.clearType = 6; break;
						case 6: musicDetail.clearType = 4; break;
						}
					} else if (version!==7 && musicDetail.version===7){
						switch(musicDetail.clearType){
						case 4: musicDetail.clearType = 6; break;
						case 5: musicDetail.clearType = 4; break;
						case 6: musicDetail.clearType = 5; break;
						}
					}

					return {
						param: {
							"_":[
								musicDetail.songId,
								musicDetail.songType,
								musicDetail.score,
								musicDetail.exscore,
								musicDetail.clearType,
								musicDetail.scoreGrade,
								0,
								0,
								musicDetail.btnRate,
								musicDetail.longRate,
								musicDetail.volRate,
								musicDetail.score,
								musicDetail.clearType,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
							].join(" "),
							$: {
								"__type":"u32",
								"__count":"26"
							}
						}
					};
				})
			}
		}
	});
}

async function loadUserRivals(req: UnkownRequest, res: Response, plus:boolean) {
	const requestBody = req.body as {game: {refid: SingleXmlVariableType}};

	const foundCard = await Card.findOne({extId: v(requestBody.game.refid)});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	// TODO sistema para saber versiones

	const foundUserData = await SdvxUserDataModel.findOne({cardId: foundCard.profileId});
	if (!foundUserData) {
		return noOp(req, res, "game");
	}

	if(plus){
		return res.json({
			game:{
				rival: []
			}
		});
	}

	const kamaitachiRivals:string[] = foundUserData.rivals || [];

	// get scores for every rival
	const allRivalsScores = await Promise.all(kamaitachiRivals.map(async rival => {
		const pbScores = await getSdvxPBs(rival);
		return {
			name: rival.slice(0, 8).toUpperCase(),
			scores: pbScores
		};
	}));

	return res.json({
		game:{
			rival: allRivalsScores.map((rivalData, index) => ({
				no: xmlVar((index).toString(), "s16"),
				seq: xmlVar(index.toString().padStart(8, "0"), "str"),
				name: xmlVar(rivalData.name, "str"),
				music: rivalData.scores.map(score => ({
					param: {
						"_":score.join(" "),
						$: {
							"__type": "u32",
							"__count":"6"
						}
					}
				}))
			}))
		}
	});
}

async function saveUserData(req: UnkownRequest, res: Response, plus:boolean) {
	const userData = req.body as UpsertUserDataType;

	const foundCard = await Card.findOne({extId: v(userData.game.refid)});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	if(userData.game.arena) {
		// Update arena
		await SdvxUserArenaModel.findOneAndUpdate(
			{cardId: foundCard.profileId, version: 7, season: v(userData.game.arena.season)},
			{
				$inc: {
					rankPoint: parseInt(v(userData.game.arena.earned_rank_point)),
					shopPoint: parseInt(v(userData.game.arena.earned_shop_point)),
					ultimateRate: parseInt(v(userData.game.arena.earned_ultimate_rate)),
					megamixRate: parseInt(v(userData.game.arena.earned_megamix_rate)),
					rankPlayCnt: v(userData.game.arena.rank_play) === "true" ? 1 : 0,
					ultimatePlayCnt: v(userData.game.arena.ultimate_play) === "true" ? 1 : 0
				}
			}, {upsert: true}
		);
	}

	// Update items
	if (userData.game.item){
		// The xml to json converter doesn't understand arrays with a single element
		if (!Array.isArray(userData.game.item.info)) {
			userData.game.item.info = [userData.game.item.info];
		}
		for (const itemInfo of userData.game.item.info){
			if (!itemInfo.type || !itemInfo.id || !itemInfo.param) continue;

			await SdvxUserItemModel.findOneAndUpdate(
				{cardId: foundCard.profileId, version: 7, type: v(itemInfo.type), id: v(itemInfo.id)},
				{
					$set:{
						param: itemInfo.param._
					}
				},
				{upsert:true}
			);
		}
	}

	// Update params
	if (userData.game.param && !plus){
		// The xml to json converter doesn't understand arrays with a single element
		if (!Array.isArray(userData.game.param.info)) {
			userData.game.param.info = [userData.game.param.info];
		}
		for (const paramInfo of userData.game.param.info){
			if (!paramInfo.type || !paramInfo.id || !paramInfo.param) continue;

			await SdvxUserParamModel.findOneAndUpdate(
				{cardId: foundCard.profileId, version: 7, type: v(paramInfo.type), id: v(paramInfo.id)},
				{
					$set:{
						param: paramInfo.param._
					},
					$inc:{
						count: parseInt(paramInfo.param.$.__count)
					}
				},
				{upsert:true}
			);
		}
	}

	// Update courses
	if (userData.game.course){
		await SdvxUserCourseModel.findOneAndUpdate(
			{cardId: foundCard.profileId, version: 7, ssnid: v(userData.game.course.ssnid), crsid: v(userData.game.course.crsid)},
			{
				$set:{
					st: v(userData.game.course.st),
					sc: v(userData.game.course.sc),
					ex: v(userData.game.course.ex),
					ct: v(userData.game.course.ct),
					gr: v(userData.game.course.gr),
					ar: v(userData.game.course.ar)
				},
				$inc:{
					cnt: 1
				}
			},
			{upsert:true}
		);
	}

	// Update variantgate
	if (userData.game.variant_gate) {
		await SdvxUserVariantGateModel.findOneAndUpdate(
			{cardId: foundCard.profileId, version: 7},
			{
				$set: userData.game.variant_gate.over_radar ? {
					overRadar: userData.game.variant_gate.over_radar.$.__count
				} : {},
				$inc: {
					power: parseInt(v(userData.game.variant_gate.earned_power) || "0"),
					"element.notes": parseInt(v(userData.game.variant_gate.earned_element.notes || "0")),
					"element.peak": parseInt(v(userData.game.variant_gate.earned_element.peak || "0")),
					"element.tsumami": parseInt(v(userData.game.variant_gate.earned_element.tsumami || "0")),
					"element.tricky": parseInt(v(userData.game.variant_gate.earned_element.tricky || "0")),
					"element.onehand": parseInt(v(userData.game.variant_gate.earned_element.onehand || "0")),
					"element.handtrip": parseInt(v(userData.game.variant_gate.earned_element.handtrip || "0")),
				}
			}, {upsert: true}
		);
	}

	const foundUserData = await SdvxUserDataModel.findOne({cardId: foundCard.profileId, version: 7}).lean();
	if (!foundUserData) {
		return noOp(req, res, "game");
	}

	const now = new Date();
	const streaks:Record<string, number> = {playCount:1};

	if (foundUserData.lastPlayed) {
		const lastPlayDate = new Date(foundUserData.lastPlayed);
		const diffTime = now.getTime() - lastPlayDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			// The user played today

			streaks.todayCount = 1;
		} else{
			// The user played in the past
			streaks.dayCount = 1;
			// Reset today count since its a new day
			streaks.todayCount = -foundUserData.todayCount + 1;

			if (diffDays === 1) {
				// The user played yesterday, continue streak
				streaks.playChain = 1;
				// Update max play chain if needed
				if (streaks.playChain > foundUserData.maxPlayChain) {
					streaks.maxPlayChain = streaks.playChain - foundUserData.maxPlayChain;
				}
			} else {
				// The user didn't play yesterday, reset streak
				streaks.playChain = -foundUserData.playChain + 1;
			}

			// Weekly streaks
			const currentWeek = getWeekNumber(now);
			const lastPlayWeek = getWeekNumber(lastPlayDate);

			if (currentWeek !== lastPlayWeek) {
				// New week
				streaks.weekCount = 1;
				streaks.weekPlayCount = 1;

				if (currentWeek - lastPlayWeek === 1 || (currentWeek === 1 && lastPlayWeek === 52)) {
					// Continue week streak
					streaks.weekChain = 1;
					// Update max week chain if needed
					if (streaks.weekChain > foundUserData.maxWeekChain) {
						streaks.maxWeekChain = streaks.weekChain - foundUserData.maxWeekChain;
					}
				} else {
					// Reset week streak
					streaks.weekChain = -foundUserData.weekChain + 1;
				}
			}
		}
	}

	await SdvxUserDataModel.updateOne(
		{cardId: foundCard.profileId, version: 6},
		{
			$set:{
				lastPlayed: now,
				lastMusicId: v(userData.game.music_id),
				lastMusicType: v(userData.game.music_type),
				appealId: v(userData.game.appeal_id),
				skillLevel: v(userData.game.skill_level),
				skillBaseId: v(userData.game.skill_base_id),
				skillNameId: v(userData.game.skill_name_id),
				skillType: v(userData.game.skill_type),
				hispeed: v(userData.game.hispeed),
				lanespeed: v(userData.game.lanespeed),
				gaugeOption: v(userData.game.gauge_option),
				arsOption: v(userData.game.ars_option),
				notesOption: v(userData.game.notes_option),
				earlyLateDisp: v(userData.game.early_late_disp),
				drawAdjust: v(userData.game.draw_adjust),
				effCLeft: v(userData.game.eff_c_left),
				effCRight: v(userData.game.eff_c_right),
				sortType: v(userData.game.sort_type),
				narrowDown: v(userData.game.narrow_down),
				headphone: v(userData.game.headphone),
			},
			$inc:{
				...streaks,
				gamecoinPacket: parseInt(v(userData.game.earned_gamecoin_packet)),
				gamecoinBlock: parseInt(v(userData.game.earned_gamecoin_block)),
				blasterEnergy: parseInt(v(userData.game.earned_blaster_energy)),
				"eaShop.packetBooster": -parseInt(v(userData.game.ea_shop?.used_packet_booster || "0")),
				"eaShop.blockBooster": -parseInt(v(userData.game.ea_shop?.used_block_booster || "0")),
			}
		}
	);

	return res.json({
		game: {}
	});
}

async function saveUserPlaylog(req: UnkownRequest, res: Response, version:number, plus:boolean) {
	const userPlaylog = req.body as UpsertUserPlaylogType;

	const foundCard = await Card.findOne({extId: v(userPlaylog.game.refid)});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	const userData = await SdvxUserDataModel.findOne({cardId: foundCard.profileId, version});

	if (!userData) {
		return noOp(req, res, "game");
	}

	if(!Array.isArray(userPlaylog.game.track)) {
		userPlaylog.game.track = [userPlaylog.game.track];
	}

	for (const track of userPlaylog.game.track) {
		await SdvxUserPlaylogModel.create({
			cardId: foundCard.profileId,
			version: version,
			plus,
			trackId: v(track.track_no),
			songId: v(track.music_id),
			songType: v(track.music_type),
			score: v(track.score),
			exscore: v(track.exscore),
			clearType: v(track.clear_type),
			scoreGrade: v(track.score_grade),
			maxChain: v(track.max_chain),
			just: v(track.just),
			critical: v(track.critical),
			near: v(track.near),
			error: v(track.error),
			effectiveRate: v(track.effective_rate),
			btnRate: v(track.btn_rate),
			longRate: v(track.long_rate),
			volRate: v(track.vol_rate),
			mode: v(track.mode),
			startOption: v(track.start_option),
			gaugeType: v(track.gauge_type),
			notesOption: v(track.notes_option),
			onlineNum: v(track.online_num),
			localNum: v(track.local_num),
			challengeType: v(track.challenge_type),
			retryCnt: v(track.retry_cnt),
			judge: v(track.judge),
			dropFrame: v(track.drop_frame),
			dropFrameMax: v(track.drop_frame_max),
			dropCount: v(track.drop_count),
			etc: v(track.etc),
			mixId: v(track.mix_id),
			mixLike: v(track.mix_like),

			matching: track.matching ? track.matching.map(match => ({
				code: v(match.code),
				score: v(match.score),
			})) : [],
		});

		const previousPB = await SdvxUserMusicDetailModel.findOne({
			cardId: foundCard.profileId,
			songId: parseInt(v(track.music_id)),
			songType: parseInt(v(track.music_type)),
		}).lean();

		if (!previousPB) {
			await SdvxUserMusicDetailModel.create({
				cardId: foundCard.profileId,
				version,
				sdvxId: userData.sdvxId,
				name: userData.name,
				plus,

				songId: parseInt(v(track.music_id)),
				songType: parseInt(v(track.music_type)),
				score: parseInt(v(track.score)),
				exscore: parseInt(v(track.exscore)),
				clearType: parseInt(v(track.clear_type)),
				scoreGrade: parseInt(v(track.score_grade)),

				btnRate: parseInt(v(track.btn_rate)),
				longRate: parseInt(v(track.long_rate)),
				volRate: parseInt(v(track.vol_rate)),
			});

			return noOp(req, res, "game");
		}

		const previousPBMutable = JSON.parse(JSON.stringify(previousPB));

		delete previousPBMutable._id;

		if (parseInt(v(track.score)) > previousPB.score) {
			previousPBMutable.score = parseInt(v(track.score));
		}

		if (parseInt(v(track.exscore)) > previousPB.exscore) {
			previousPBMutable.exscore = parseInt(v(track.exscore));
		}

		if (parseInt(v(track.clear_type)) > previousPB.clearType) {
			previousPBMutable.clearType = parseInt(v(track.clear_type));
		}

		if (parseInt(v(track.score_grade)) > previousPB.scoreGrade) {
			previousPBMutable.scoreGrade = parseInt(v(track.score_grade));
		}

		if (parseInt(v(track.btn_rate)) > previousPB.btnRate) {
			previousPBMutable.btnRate = parseInt(v(track.btn_rate));
		}

		if (parseInt(v(track.long_rate)) > previousPB.longRate) {
			previousPBMutable.longRate = parseInt(v(track.long_rate));
		}

		if (parseInt(v(track.vol_rate)) > previousPB.volRate) {
			previousPBMutable.volRate = parseInt(v(track.vol_rate));
		}

		previousPBMutable.version = version;

		await SdvxUserMusicDetailModel.findOneAndReplace(
			{
				cardId: foundCard.profileId,
				songId: parseInt(v(track.music_id)),
				songType: parseInt(v(track.music_type)),
			},
			previousPBMutable
		);
	}

	return noOp(req, res, "game");
}

async function saveWeeklyMusic(req: UnkownRequest, res: Response, version:number) {
	const requestBody = req.body as SaveWeeklyMusicType;

	const foundCard = await Card.findOne({extId: v(requestBody.game.refid)});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	if(requestBody.game.weekly_music) {
		if(!Array.isArray(requestBody.game.weekly_music)) {
			requestBody.game.weekly_music = [requestBody.game.weekly_music];
		}

		for (const weeklyMusic of requestBody.game.weekly_music) {
			const existingEntries = await SdvxUserWeeklyMusicModel.find({
				weekId: v(weeklyMusic.week_id),
				musicId: v(weeklyMusic.music_id),
				musicType: v(weeklyMusic.music_type),
			});

			const userEntry = existingEntries.find(entry => entry.cardId === foundCard.profileId);
			let newRank = 1;
			const newScore = userEntry ? Math.max(parseInt(v(weeklyMusic.exscore)), parseInt(userEntry.exscore)) : parseInt(v(weeklyMusic.exscore));

			for (const entry of existingEntries) {
				if (entry.cardId === foundCard.profileId) continue;

				if (parseInt(entry.exscore) > newScore) {
					newRank++;
				}
			}

			await SdvxUserWeeklyMusicModel.findOneAndUpdate(
				{
					cardId: foundCard.profileId,
					version,
					weekId: v(weeklyMusic.week_id),
					musicId: v(weeklyMusic.music_id),
					musicType: v(weeklyMusic.music_type),
				},
				{
					$set:{
						exscore: newScore.toString(),
						rank: newRank.toString(),
					}
				},
				{upsert:true}
			);
		}
	}

	return noOp(req, res, "game");
}

async function giveValgenePrice(req: UnkownRequest, res: Response) {
	const requestBody = req.body as ValgenResult;

	if (!Array.isArray(requestBody.game.item.info)) {
		requestBody.game.item.info = [requestBody.game.item.info];
	}

	const foundCard = await Card.findOne({extId: v(requestBody.game.refid)});

	if(!foundCard) {
		return noOp(req, res, "game");
	}

	// TODO sistema para saber versiones

	const result = xmlVar("1", "s32") as Record<string, unknown>;

	if (v(requestBody.game.use_ticket)==="1"){
		const userData = await SdvxUserDataModel.findOneAndUpdate({
			cardId: foundCard.profileId,
		}, {
			$inc: {
				"valgeneTicket.ticketNum":-1
			}
		}, {new:true});

		result["ticket_num"] = xmlVar(userData?.valgeneTicket?.ticketNum.toString() || "0", "s32");
		result["limit_date"] = xmlVar(userData?.valgeneTicket?.limitDate.toString() || "0",
			"u64");
	}

	const itemsToAdd:Omit<SdvxUserItemType, "_id">[] = [];

	for (const itemInfo of requestBody.game.item.info){
		if (!itemInfo.type || !itemInfo.id || !itemInfo.param) continue;

		const id = parseInt(v(itemInfo.id));
		const type = v(itemInfo.type);

		if (type === "17"){
			for (let stampId = ((id * 4) - 3); stampId <= (id * 4); stampId++) {
				itemsToAdd.push({
					cardId: foundCard.profileId,
					version: 6,
					type,
					id: `${stampId}`,
					param: v(itemInfo.param)
				});
			}
		}else {
			itemsToAdd.push({
				cardId: foundCard.profileId,
				version: 6,
				type,
				id: `${id}`,
				param: v(itemInfo.param),
			});
		}
	}

	await Promise.all(itemsToAdd.map(async item => {
		await SdvxUserItemModel.findOneAndUpdate(
			{cardId: item.cardId, version: item.version, type: item.type, id: item.id},
			{
				$set:{
					param: item.param
				}
			},
			{upsert:true}
		);
	}));

	return res.json({
		game: {
			result
		}
	});
}

function checkCoinBalance(req: UnkownRequest, res: Response) {
	return res.json({
		eacoing: {
			sequence: xmlVar("1", "s16"),
			acstatus: xmlVar("1", "u8"),
			acid: xmlVar("1", "str"),
			acname: xmlVar("MB", "str"),
			balance: xmlVar("573", "s32"),
			sessid: xmlVar("0", "str"),
			inshopcharge: xmlVar("1", "u8"),
		}
	});
}

function exchangeCoin(req: UnkownRequest, res: Response) {
	return res.json({
		eacoin: {
			acstatus: xmlVar("0", "u8"),
			autocharge: xmlVar("0", "u8"),
			balance: xmlVar("573", "s32"),
		}
	});
}

// ONLINE FUNCTIONS
async function matchMaking(req: UnkownRequest, res: Response) {
	const requestBody = req.body as MatchMakingRequestType;

	const globalIp = v(requestBody.game.gip).replace(/ /g, ".");
	const localIp = v(requestBody.game.lip).replace(/ /g, ".");

	console.log("[" + localIp + " | " + globalIp + "] Searching for online match opponents");

	// 	remove all matches older than 100 seconds
	await SdvxMatchModel.deleteMany({
		lastUpdate: { $lt: new Date(Date.now() - 100 * 1000) }
	});

	// Comprueba si existen partidas activas
	const existingMatches = await SdvxMatchModel.find({
		cVer: v(requestBody.game.c_ver),
		filter: v(requestBody.game.filter),
		claim: v(requestBody.game.claim),
	});

	let roomId = "0";

	// Si existe se coge el primer roomId
	if(existingMatches.length){
		roomId = existingMatches[0]!.entryId;
	} else {
		// Si no existe se crea uno nuevo
		roomId = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
	}

	// Buscar jugadores en la misma sala
	const opponents = existingMatches.filter(match => match.entryId === roomId);

	if(opponents.length>4){
		return noOp(req, res, "game");
	}

	await SdvxMatchModel.create({
		cVer: v(requestBody.game.c_ver),
		pNum: v(requestBody.game.p_num),
		pRest: v(requestBody.game.p_rest),
		filter: v(requestBody.game.filter),
		mid: v(requestBody.game.mid),
		sec: v(requestBody.game.sec),
		port: v(requestBody.game.port),
		gip: globalIp,
		lip:localIp,
		claim: v(requestBody.game.claim),
		entryId: roomId,
		lastUpdate: new Date(),
	});

	const response = {
		game:{
			entry_id: xmlVar(roomId, "u32")
		}
	} as {
		game: {
			entry_id: SingleXmlVariableType,
			entry?: {
				port: SingleXmlVariableType|string,
				gip: SingleXmlVariableType|string,
				lip: SingleXmlVariableType|string,
			}[]
		}
	};

	if(opponents.length){
		response.game.entry = opponents.map(opponent => ({
			port: xmlVar(opponent.port, "u16"),
			gip: xmlVar(opponent.gip.replace(/\./g, " "), "4u8"),
			lip: xmlVar(opponent.lip.replace(/\./g, " "), "4u8"),
		}));
	}

	return res.json(response);
}

async function lounge(req: UnkownRequest, res: Response) {
	const requestBody = req.body as LoungeRequestType;

	const filter = v(requestBody.game.filter);

	// 	remove all matches older than 100 seconds
	await SdvxMatchModel.deleteMany({
		lastUpdate: { $lt: new Date(Date.now() - 100 * 1000) }
	});

	const matches = await SdvxMatchModel.find({
		filter: filter,
	});

	if(!matches.length){
		return res.json({
			game:{
				interval: xmlVar("30", "u32"),
			}
		});
	} else{
		const highestWaitTime = matches.reduce((max, match) => {
			const matchWaitTime = parseInt(match.sec);
			return matchWaitTime > max ? matchWaitTime : max;
		}, 0);

		return res.json({
			game: {
				interval: xmlVar("30", "u32"),
				wait_time: xmlVar(highestWaitTime.toString(), "u32"),
			}
		});
	}
}


function noOp(req: UnkownRequest, res: Response, root:string) {
	return res.json({
		[root]: {
			$: {
				status: "0"
			}
		}
	});
}

export default sdvxRouter;