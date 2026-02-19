import {customValidateRequest} from "../../utils/zod.ts";
import z from "zod";
import {type Request, Router} from "express";
import {SdvxUserDataModel} from "../../games/sdvx/models/userdata.model.ts";
import {customizeDto, importSvdxMusicDto} from "../../dto/sdvx.dto.ts";
import {SdvxUserMusicDetailModel} from "../../games/sdvx/models/usermusicdetail.model.ts";
import {SdvxUserParamModel} from "../../games/sdvx/models/userparam.model.ts";
import {SdvxUserArenaModel} from "../../games/sdvx/models/userarena.model.ts";
import {SdvxGameAkanameModel} from "../../games/sdvx/models/gameakaname.model.ts";
import {SdvxGameMusicModel} from "../../games/sdvx/models/gamemusic.model.ts";
import {SdvxGameCourseModel} from "../../games/sdvx/models/gamecourse.model.ts";
import {SdvxGameCustomModel} from "../../games/sdvx/models/gamecustom.model.ts";
import {SdvxUserPlaylogModel} from "../../games/sdvx/models/userplaylog.model.ts";

const sdvxApiRouter = Router({mergeParams: true});

const LAST_VERSION = 7;

sdvxApiRouter.get("/akanames", async (req: Request, res) => {
	const allAkanames = await SdvxGameAkanameModel.find({}).sort({id: 1});

	res.json(allAkanames);
});

sdvxApiRouter.get("/music", async (req: Request, res) => {
	const allMusic = await SdvxGameMusicModel.find({}).sort({id: 1});

	res.json(allMusic);
});

sdvxApiRouter.get("/customs", async (req: Request, res) => {
	const allCustoms = await SdvxGameCustomModel.find({}).sort({id: 1});

	res.json(allCustoms);
});

sdvxApiRouter.get("/usercourses", async (req: Request, res) => {
	const cardId = req.cardId;
	const foundCourses = await SdvxGameCourseModel.aggregate()
		.match({
			skillId:{$lte:12}
		})
		.addFields({
			ssnid: { $toString: "$seasonId" },
			crsid: { $concat: [ { $toString: "$seasonId" }, { $toString: "$id" } ] }
		})
		.lookup({
			from: "sdvxusercourses",
			let: { crsid: "$crsid", ssnid: "$ssnid" },
			pipeline: [
				{ $match:
						{ $expr:
								{ $and:
										[
											{ $eq: [ "$crsid",  "$$crsid" ] },
											{ $eq: [ "$ssnid",  "$$ssnid" ] },
											{ $eq: [ "$cardId", cardId ] },
										]
								}
						}
				},
			],
			as: "userCourseData"
		})
		.unwind({
			path: "$userCourseData",
			preserveNullAndEmptyArrays: true,
		});

	res.json(foundCourses);
});

sdvxApiRouter.get("/ranking", async (_: Request, res) => {
	const usersRanking = await SdvxUserDataModel.aggregate()
		.match({version:LAST_VERSION})
		.lookup({
			from: "sdvxuserparams",
			// search by card and version equal to the last
			let: { cardId: "$cardId" },
			pipeline: [
				{ $match:
						{ $expr:
								{ $and:
										[
											{ $eq: [ "$cardId",  "$$cardId" ] },
											{ $eq: [ "$version",  LAST_VERSION ] },
										]
								}
						}
				},
			],
			as: "params"
		})
		.lookup({
			from: "sdvxuserarenas",
			localField: "cardId",
			foreignField: "cardId",
			as: "arena"
		})
		.addFields({
			arena: {$arrayElemAt: ["$arena", 0]},
		})
		.project({
			name:1,
			params:1,
			arena:1,
			skillLevel:1,
		});
	res.json(usersRanking);
});

sdvxApiRouter.get("/userdata", async (req: Request, res) => {
	const foundUserData = await SdvxUserDataModel.find({cardId: req.cardId}).sort({version: -1});

	res.json(foundUserData);
});

sdvxApiRouter.get("/userparams", async (req: Request, res) => {
	const foundUserParams = await SdvxUserParamModel.find({cardId: req.cardId, version:LAST_VERSION}).sort({version: -1});

	res.json(foundUserParams);
});

sdvxApiRouter.get("/usermusic", async (req: Request, res) => {
	const foundUserMusic = await SdvxUserMusicDetailModel.find({cardId: req.cardId});

	res.json(foundUserMusic.map(m=>{
		if(m.version===7) {
			switch (m.clearType) {
			case 4:
				m.clearType = 6;
				break;
			case 5:
				m.clearType = 4;
				break;
			case 6:
				m.clearType = 5;
				break;
			}
			return m;
		}

		return m;
	}));
});

sdvxApiRouter.get("/recentmusic", async (req: Request, res) => {
	const recentMusic = await SdvxUserPlaylogModel.find({cardId: req.cardId}).sort({_id: -1}).limit(20).lean();

	res.json(recentMusic.map(m=>{
		if(m.version===7){
			switch(m.clearType){
			case "4": m.clearType = "6"; break;
			case "5": m.clearType = "4"; break;
			case "6": m.clearType = "5"; break;
			}
			return m;
		}
		return m;
	}));
});

sdvxApiRouter.get("/playlog/:musicId/:diff", async (req: Request, res) => {
	const {musicId, diff} = req.params;
	const playlogs = await SdvxUserPlaylogModel.find({cardId: req.cardId, songId: musicId, songType: diff}).sort({score: -1}).limit(1).lean();

	res.json(playlogs.map(m=>{
		if(m.version===7){
			switch(m.clearType){
			case "4": m.clearType = "6"; break;
			case "5": m.clearType = "4"; break;
			case "6": m.clearType = "5"; break;
			}
			return m;
		}
		return m;
	}));
});

sdvxApiRouter.get("/userarena", async (req: Request, res) => {
	const foundUserArena = await SdvxUserArenaModel.findOne({cardId: req.cardId}).sort({season: -1});

	res.json(foundUserArena);
});

sdvxApiRouter.patch("/rivals",
	customValidateRequest({
		body: z.object({
			rivals: z.array(z.string()).max(5)
		})
	}),
	async (req, res) => {
		await SdvxUserDataModel.findOneAndUpdate(
			{cardId: req.cardId, version:6},
			{$set: {rivals: req.body.rivals}},
			{new: true}
		);

		res.json({message: "Rivals updated"});
	});

sdvxApiRouter.patch("/customize",
	customValidateRequest({
		body:customizeDto
	}),
	async (req, res) => {
		const version = req.body.version;

		// Update User Data
		await SdvxUserDataModel.updateMany(
			{cardId: req.cardId, version},
			{$set: req.body.userData}
		);

		// Update Akaname Param
		await SdvxUserParamModel.findOneAndUpdate(
			{cardId: req.cardId, version, id:"0", type:"6"},
			{param: req.body.akanameParam.param},
			{upsert:true}
		);

		// Update Custom Param
		await SdvxUserParamModel.findOneAndUpdate(
			{cardId: req.cardId, version, id:"2", type:"2"},
			{param: req.body.customParam.param, count:12},
			{upsert:true}
		);

		res.json({message: "Customization updated"});
	});

sdvxApiRouter.post("/music/import",
	customValidateRequest({
		body: z.array(importSvdxMusicDto).min(1)
	}),
	async (req, res) => {
		const foundAccount = await SdvxUserDataModel.findOne({cardId: req.cardId});

		if (!foundAccount) {
			return res.status(403).json({message: "You have not played"});
		}

		const currentUserMusic = await SdvxUserMusicDetailModel.find({cardId: req.cardId});
		const currentUserMusicMap = new Map(currentUserMusic.map((m) => [`${m.songId}-${m.songType}`, m]));

		const bulkOps = [];
		for (const musicEntry of req.body) {
			const existingEntry = currentUserMusicMap.get(`${musicEntry.songId}-${musicEntry.songType}`);
			if (existingEntry) {
				// 	update score if higher
				if (musicEntry.score > existingEntry.score) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									score: musicEntry.score,
									scoreGrade: musicEntry.scoreGrade,
								}
							}
						}
					});
				}

				// 	Update max grade if higher
				if (musicEntry.clearType > existingEntry.clearType) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									clearType: musicEntry.clearType,
								}
							}
						}
					});
				}
			} else {
				// Insert new entry
				bulkOps.push({
					insertOne: {
						document: {
							...musicEntry,
							cardId: req.cardId
						}
					}
				});
			}
		}

		if (bulkOps.length > 0) {
			await SdvxUserMusicDetailModel.bulkWrite(bulkOps);
		}

		res.json({message: "Import complete", updated: bulkOps.length});
	});

export default sdvxApiRouter;
