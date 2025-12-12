import {type Request, Router} from "express";
import {Chu3UserData} from "../../games/chu3/models/userdata.model.ts";
import {Chu3UserCharacter} from "../../games/chu3/models/usercharacter.model.ts";
import {Chu3UserTeam} from "../../games/chu3/models/userteam.model.ts";
import {Chu3GameTrophy} from "../../games/chu3/models/gametrophy.model.ts";
import {Chu3UserMisc} from "../../games/chu3/models/usermisc.model.ts";
import {Chu3GameMusic} from "../../games/chu3/models/gamemusic.model.ts";
import {Chu3GameCharacter} from "../../games/chu3/models/gamecharacter.model.ts";
import {Chu3UserGameOption} from "../../games/chu3/models/usergameoption.model.ts";
import {customValidateRequest} from "../../utils/zod.ts";
import {
	importChu3MusicDto,
	UpdateChu3TeamDto,
	UpdateChu3UserChatSymbolsDto,
	UpdateChu3UserDataDto,
	UpdateChu3UserOptionsDto,
	UpdateChu3UserRivalsDto
} from "../../dto/chuni.dto.ts";
import {Chu3UserMusicDetail} from "../../games/chu3/models/usermusicdetail.model.ts";
import {Chu3GameMap} from "../../games/chu3/models/gamemap.model.ts";
import {Chu3UserMapArea} from "../../games/chu3/models/usermaparea.model.ts";
import {Chu3GameCMission} from "../../games/chu3/models/gamecmission.model.ts";
import {Chu3UserCmission} from "../../games/chu3/models/usercmission.model.ts";
import {Chu3UserPlaylog} from "../../games/chu3/models/userplaylog.model.ts";
import {Types} from "mongoose";
import {Chu3GameSkill} from "../../games/chu3/models/gameskill.model.ts";
import {Chu3GameCourse} from "../../games/chu3/models/gamecourse.model.ts";
import {Chu3UserCourse} from "../../games/chu3/models/usercourse.model.ts";
import {Chu3UserRegion} from "../../games/chu3/models/userregion.model.ts";
import {Chu3UserItem} from "../../games/chu3/models/useritem.model.ts";
import {Chu3GameTicket} from "../../games/chu3/models/gameticket.model.ts";
import {Chu3GameChatSymbol} from "../../games/chu3/models/gamechatsymbol.model.ts";
import {Chu3Team} from "../../games/chu3/models/team.model.ts";
import type {Chu3TeamType, Chu3UserTeamType} from "../../games/chu3/types/team.types.ts";
import type {Chu3UserDataType} from "../../games/chu3/types/userdata.types.ts";
import z from "zod";
import {Chu3GameShopItem} from "../../games/chu3/models/gameshopitem.model.ts";
import {deleteRedisKey} from "../../modules/redis.ts";

const chuniApiRouter = Router({mergeParams: true});


chuniApiRouter.get("/userdata", async (req: Request, res) => {
	const foundUserData = await Chu3UserData.findOne({cardId: req.cardId}).sort({version: -1});

	res.json(foundUserData);
});

chuniApiRouter.get("/userchars", async (req: Request, res) => {
	const foundCharacters = await Chu3UserCharacter.find({cardId: req.cardId});

	res.json(foundCharacters);
});

chuniApiRouter.get("/usermisc", async (req: Request, res) => {
	const foundMisc = await Chu3UserMisc.findOne({cardId: req.cardId});

	res.json(foundMisc);
});

chuniApiRouter.get("/userteam", async (req: Request, res) => {
	const userTeam = await Chu3UserTeam.aggregate<Chu3UserTeamType & {teamInfo: Chu3TeamType, teamMembers: (Chu3UserTeamType & {info: Partial<Chu3UserDataType> | null})[], memberInfo?: Partial<Chu3UserDataType>[], ownerInfo: {username: string}}>()
		.match({cardId: req.cardId})
		.lookup({
			from: "chu3teams",
			localField: "teamId",
			foreignField: "teamId",
			as: "teamInfo"
		})
		.unwind({path: "$teamInfo"})
		.lookup({
			from: "chu3userteams",
			localField: "teamId",
			foreignField: "teamId",
			as: "teamMembers"
		})
		.lookup({
			from: "chu3userdatas",
			let: {members: "$teamMembers.cardId"},
			pipeline: [
				{$match: {$expr: {$in: ["$cardId", "$$members"]}}},
				{$project: {version:1, cardId:1, userName:1, trophyId:1, trophyIdSub1:1, trophyIdSub2:1, level:1, battleRankId:1, playerRating:1, overPowerPoint:1, lastPlayDate:1, characterId:1, classEmblemBase:1, classEmblemMedal:1, overPowertRate:1}}
			],
			as: "memberInfo"
		})
		.lookup({
			from: "users",
			let: {user: "$teamInfo.ownerId"},
			pipeline: [
				{$match: {$expr: {$eq: ["$_id", "$$user"]}}},
				{$project: {username: 1}}
			],
			as: "ownerInfo"
		})
		.unwind({path: "$ownerInfo", preserveNullAndEmptyArrays: true});

	if (userTeam.length === 0) {
		return res.json({});
	}

	const [team] = userTeam;

	// Assign the memberinfo to each team member
	team!.teamMembers.map((member) => {
		const memberInfo = team!.memberInfo!.sort((a, b) => b.version! - a.version!).find((info) => info.cardId === member.cardId);
		member.info = memberInfo || null;
		delete memberInfo?.cardId;
		return member;
	});

	// Filter members without info
	team!.teamMembers = team!.teamMembers.filter((member) => member.info !== null);

	delete team!.memberInfo;

	res.json(team);
});

chuniApiRouter.get("/options", async (req: Request, res) => {
	const userOptions = await Chu3UserGameOption.findOne({cardId: req.cardId});

	res.json(userOptions);
});

chuniApiRouter.get("/userMusic", async (req: Request, res) => {
	const userMusic = await Chu3UserMusicDetail.find({cardId: req.cardId});

	res.json(userMusic);
});

chuniApiRouter.get("/userMaps", async (req: Request, res) => {
	const userMaps = await Chu3UserMapArea.find({cardId: req.cardId});

	res.json(userMaps);
});

chuniApiRouter.get("/userCMissions", async (req: Request, res) => {
	const userCMissions = await Chu3UserCmission.find({cardId: req.cardId});

	res.json(userCMissions);
});

chuniApiRouter.get("/userPlaylog", async (req: Request, res) => {
	const userPlaylog = await Chu3UserPlaylog.find({cardId: req.cardId}).sort({userPlayDate: -1}).limit(100);

	res.json(userPlaylog);
});

chuniApiRouter.get("/userPlaylog/:playlogId", async (req: Request, res) => {
	const userPlaylog = await Chu3UserPlaylog.findById(new Types.ObjectId(req.params.playlogId));

	res.json(userPlaylog);
});

chuniApiRouter.get("/userCourses", async (req: Request, res) => {
	const userCourses = await Chu3UserCourse.find({cardId: req.cardId});

	res.json(userCourses);
});

chuniApiRouter.get("/regions", async (req: Request, res) => {
	const userRegions = await Chu3UserRegion.find({cardId: req.cardId});

	res.json(userRegions);
});

chuniApiRouter.get("/items", async (req: Request, res) => {
	const userItems = await Chu3UserItem.find({cardId: req.cardId});

	res.json(userItems);
});


// GAME
chuniApiRouter.get("/trophies", async (req: Request, res) => {
	const gameTrophies = await Chu3GameTrophy.find().sort({id: 1});

	res.json(gameTrophies);
});

chuniApiRouter.get("/music", async (req: Request, res) => {
	const gameMusic = await Chu3GameMusic.find({worldsEndType: "Invalid"}).sort({sortName: 1});

	res.json(gameMusic);
});

chuniApiRouter.get("/wemusic", async (req: Request, res) => {
	const gameMusic = await Chu3GameMusic.find({worldsEndType: {$ne: "Invalid"}}).sort({sortName: 1});

	res.json(gameMusic);
});

chuniApiRouter.get("/characters", async (req: Request, res) => {
	const gameCharacters = await Chu3GameCharacter.find().sort({sortName: 1});

	res.json(gameCharacters);
});

chuniApiRouter.get("/maps", async (req: Request, res) => {
	const gameMaps = await Chu3GameMap.find().sort({id: 1});

	res.json(gameMaps);
});

chuniApiRouter.get("/cmissions", async (req: Request, res) => {
	const gameCMissions = await Chu3GameCMission.find().sort({id: 1});

	res.json(gameCMissions);
});

chuniApiRouter.get("/skills", async (req: Request, res) => {
	const gameSkills = await Chu3GameSkill.find().sort({id: 1});

	res.json(gameSkills);
});

chuniApiRouter.get("/courses", async (req: Request, res) => {
	const gameCourses = await Chu3GameCourse.find().sort({id: 1});

	res.json(gameCourses);
});

chuniApiRouter.get("/tickets", async (req: Request, res) => {
	const tickets = await Chu3GameTicket.find().sort({id: 1});

	res.json(tickets);
});

chuniApiRouter.get("/chatsymbols", async (req: Request, res) => {
	const gameChatSymbols = await Chu3GameChatSymbol.find().sort({id: 1});

	res.json(gameChatSymbols);
});

chuniApiRouter.get("/teams", async (req: Request, res) => {
	const teams = await Chu3Team.aggregate()
		.lookup({
			from: "chu3userteams",
			localField: "teamId",
			foreignField: "teamId",
			as: "members"
		})
		.addFields({
			memberCount: {$size: "$members"}
		})
		.project({members: 0});

	res.json(teams);
});

chuniApiRouter.get("/ranking", async (req: Request, res) => {
	const topPlayers = await Chu3UserData.find({version:18})
		.sort({playerRating: -1})
		.limit(25)
		.select({userName:1, playerRating:1});

	res.json(topPlayers);
});

chuniApiRouter.get("/shop/:shopId",
	customValidateRequest({
		params: z.object({
			shopId: z.string().transform((val) => parseInt(val)).refine((val) => val>0&&val<5, {message: "Invalid shop ID"})
		})
	}),
	async (req, res) => {
		const shopItems = await Chu3GameShopItem.find({shopId: req.params.shopId}).sort({price:1, itemId: 1});

		res.json(shopItems);
	}
);

// PATCH
chuniApiRouter.patch("/options",
	customValidateRequest({
		body: UpdateChu3UserOptionsDto
	}),
	async (req: Request, res) => {
		const updatedOptions = await Chu3UserGameOption.findOneAndUpdate(
			{cardId: req.cardId},
			{$set: req.body},
			{new: true, upsert: true}
		);

		// clear user options cache
		deleteRedisKey("GetUserOptionApi", req.cardId);

		res.json(updatedOptions);
	}
);

chuniApiRouter.patch("/userdata",
	customValidateRequest({
		body: UpdateChu3UserDataDto
	}),
	async (req: Request, res) => {
		const updatedUserData = await Chu3UserData.findOneAndUpdate(
			{cardId: req.cardId, version:req.body.version},
			{$set: req.body},
			{new: true, upsert: true}
		);

		// clear userdata cache
		deleteRedisKey("GetUserDataApi", req.cardId);

		res.json(updatedUserData);
	}
);

chuniApiRouter.patch("/rivals",
	customValidateRequest({
		body: UpdateChu3UserRivalsDto
	}),
	async (req: Request, res) => {
		if (!req.body.rivals) return res.status(400).json({message: "No rivals provided"});

		const updatedUserMisc = await Chu3UserMisc.findOneAndUpdate(
			{cardId: req.cardId},
			{$set: {rivalList: req.body.rivals}},
			{new: true, upsert: true}
		);

		// clear rivals cache
		deleteRedisKey("GetUserRival", req.cardId);

		res.json(updatedUserMisc);
	}
);

chuniApiRouter.patch("/chatsymbols",
	customValidateRequest({
		body: UpdateChu3UserChatSymbolsDto
	}),
	async (req: Request, res) => {
		if (!req.body.chatSymbols) return res.status(400).json({message: "No chat symbols provided"});

		const updatedUserMisc = await Chu3UserMisc.findOneAndUpdate(
			{cardId: req.cardId},
			{$set: {chatSymbols: req.body.chatSymbols}},
			{new: true, upsert: true}
		);

		// clear userteam cache
		deleteRedisKey("GetUserSymbolChatSettingApi", req.cardId);

		res.json(updatedUserMisc);
	}
);

// POST
chuniApiRouter.post("/team/:teamId/join", async (req: Request, res) => {
	const chuniAccount = await Chu3UserData.findOne({cardId: req.cardId});
	if (!chuniAccount) {
		return res.status(403).json({message: "You have not played"});
	}

	const teamId = parseInt(req.params.teamId!);

	if (isNaN(teamId)) return res.status(400).json({message: "Invalid team ID"});

	const existingMembership = await Chu3UserTeam.findOne({cardId: req.cardId});
	if (existingMembership) {
		return res.status(400).json({message: "You are already in a team"});
	}

	const team = await Chu3Team.findOne({teamId: teamId});
	if (!team) {
		return res.status(404).json({message: "Team not found"});
	}

	const memberCount = await Chu3UserTeam.countDocuments({teamId: teamId});
	if (memberCount >= 20) {
		return res.status(400).json({message: "Team is full"});
	}
	const newMembership = await Chu3UserTeam.create({
		cardId: req.cardId,
		teamId: teamId
	});

	// clear userteam cache
	deleteRedisKey("GetUserTeamApi", req.cardId);

	res.json(newMembership);
});

chuniApiRouter.post("/team/create",
	customValidateRequest({
		body: UpdateChu3TeamDto
	}),
	async (req, res) => {
		const chuniAccount = await Chu3UserData.findOne({cardId: req.cardId});
		if (!chuniAccount) {
			return res.status(403).json({message: "You have not played"});
		}

		const existingMembership = await Chu3UserTeam.findOne({cardId: req.cardId});
		if (existingMembership) {
			return res.status(400).json({message: "You are already in a team"});
		}

		const existingTeamWithName = await Chu3Team.findOne({name: req.body.teamName});
		if (existingTeamWithName) {
			return res.status(400).json({message: "A team with that name already exists"});
		}

		const existingTeamWithOwner = await Chu3Team.findOne({ownerId: req.currentUser?.id});
		if (existingTeamWithOwner) {
			return res.status(400).json({message: "You already own a team"});
		}

		const highestTeam = await Chu3Team.findOne().sort({teamId: -1});
		const nextTeamId = highestTeam ? highestTeam.teamId + 1 : 1;

		// clear userteam cache
		deleteRedisKey("GetUserTeamApi", req.cardId);

		const newTeam = await Chu3Team.create({
			teamId: nextTeamId,
			teamName:req.body.teamName,
			ownerId: req.currentUser?.id
		});

		const newMembership = await Chu3UserTeam.create({
			cardId: req.cardId,
			teamId: newTeam.teamId
		});

		res.json(newMembership);
	});

chuniApiRouter.post("/team/leave", async (req: Request, res) => {
	const existingMembership = await Chu3UserTeam.findOne({cardId: req.cardId});
	if (!existingMembership) {
		return res.status(400).json({message: "You are not in a team"});
	}

	const team = await Chu3Team.findOne({teamId: existingMembership.teamId});
	if (!team) {
		// Should not happen, but just in case
		await existingMembership.deleteOne();
		return res.status(400).json({message: "Your team no longer exists, you have been removed from it"});
	}

	if (team.ownerId.toString() === req.currentUser?.id.toString()) {
		return res.status(400).json({message: "You are the owner of the team, you cannot leave. You can delete the team if you want to disband it."});
	}

	// clear userteam cache
	deleteRedisKey("GetUserTeamApi", req.cardId);

	await existingMembership.deleteOne();

	res.json({message: "success"});
});

chuniApiRouter.post("/team/disband", async (req: Request, res) => {
	const existingMembership = await Chu3UserTeam.findOne({cardId: req.cardId});
	if (!existingMembership) {
		return res.status(400).json({message: "You are not in a team"});
	}

	const team = await Chu3Team.findOne({teamId: existingMembership.teamId});
	if (!team) {
		// Should not happen, but just in case
		await existingMembership.deleteOne();
		return res.status(400).json({message: "Your team no longer exists, you have been removed from it"});
	}

	if (team.ownerId.toString() !== req.currentUser?.id.toString()) {
		return res.status(400).json({message: "You are not the owner of the team, only the owner can disband the team"});
	}

	// Delete all memberships
	const oldMemberships = await Chu3UserTeam.find({teamId: team.teamId});
	for (const membership of oldMemberships) {
		// clear userteam cache
		deleteRedisKey("GetUserTeamApi", membership.cardId);
	}

	await Chu3UserTeam.deleteMany({teamId: team.teamId});
	// Delete the team
	await team.deleteOne();

	res.json({message: "success"});
});

chuniApiRouter.post("/shop/purchase/:articleId",
	customValidateRequest({
		params: z.object({
			articleId: z.string().transform((val) => Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : null).refine((val) => val !== null, {message: "Invalid article ID"})
		})
	}),
	async (req, res) => {
		const chuniAccount = await Chu3UserData.findOne({cardId: req.cardId}).sort({version: -1});
		if (!chuniAccount) {
			return res.status(403).json({message: "general/not_played_yet"});
		}

		const shopItem = await Chu3GameShopItem.findById(req.params.articleId);

		if (!shopItem) {
			return res.status(404).json({message: "shop/item_not_found" });
		}

		if (shopItem.currencyType==="points"){
			if (chuniAccount.ppoint < shopItem.price) {
				return res.status(400).json({message: "shop/not_enough_ppoint" });
			}
		} else {
			if (chuniAccount.point < shopItem.price) {
				return res.status(400).json({message: "shop/not_enough_point" });
			}
		}

		let itemType = 0;

		if(shopItem.shopId===1) itemType = 5;
		else if(shopItem.itemType==="ネームプレート") itemType = 1;
		else if(shopItem.itemType==="称号") itemType = 3;
		else if(shopItem.itemType==="マップアイコン") itemType = 8;
		else if(shopItem.itemType==="システムボイス") itemType = 9;

		if(itemType===0 && shopItem.shopId!==3){
			return res.status(400).json({message: "shop/invalid_item_type" });
		}

		// Add item to user inventory
		if(shopItem.shopId===3){
			// 	Characters
			await Chu3UserCharacter.create({
				cardId: req.cardId,
				characterId: shopItem.itemId,
				assignIllust: shopItem.itemId
			});
		} else if (shopItem.shopId===1){
		// 	stockable items
			await Chu3UserItem.findOneAndUpdate(
				{cardId: req.cardId, itemId: shopItem.itemId, itemKind: itemType},
				{$inc: {stock: 1}},
				{upsert: true}
			);
		} else {
			await Chu3UserItem.create({
				cardId: req.cardId,
				itemId: shopItem.itemId,
				itemKind: itemType,
			});
		}

		// Deduct points
		if (shopItem.currencyType==="points"){
			await Chu3UserData.updateOne({cardId: req.cardId, version: chuniAccount.version}, {$inc: {ppoint: -shopItem.price}});
		} else {
			await Chu3UserData.updateOne({cardId: req.cardId, version: chuniAccount.version}, {$inc: {point: -shopItem.price}});
		}

		// clear items cache
		deleteRedisKey("GetUserItemApi", req.cardId);

		res.json({message: "success"});
	});

chuniApiRouter.post("/music/import",
	customValidateRequest({
		body: z.array(importChu3MusicDto).min(1)
	}),
	async (req: Request, res) => {
		const chuniAccount = await Chu3UserData.findOne({cardId: req.cardId});

		if (!chuniAccount) {
			return res.status(403).json({message: "You have not played"});
		}

		const currentUserMusic = await Chu3UserMusicDetail.find({cardId: req.cardId});
		const currentUserMusicMap = new Map(currentUserMusic.map((m) => [`${m.musicId}-${m.level}`, m]));

		const bulkOps = [];
		for (const musicEntry of req.body) {
			const existingEntry = currentUserMusicMap.get(`${musicEntry.musicId}-${musicEntry.level}`);
			if (existingEntry) {
				// 	update score if higher
				if (musicEntry.scoreMax > existingEntry.scoreMax) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									scoreMax: musicEntry.scoreMax,
									scoreRank: musicEntry.scoreRank,
								}
							}
						}
					});
				}

				// 	Update all justice if true
				if (musicEntry.isAllJustice && !existingEntry.isAllJustice) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									isAllJustice: true,
									isFullCombo: true,
								}
							}
						}
					});
				}

				// 	Update full combo if true
				else if (musicEntry.isFullCombo && !existingEntry.isFullCombo) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									isFullCombo: true,
								}
							}
						}
					});
				}

				// 	Update max combo if higher
				if (musicEntry.maxComboCount > existingEntry.maxComboCount) {
					bulkOps.push({
						updateOne: {
							filter: {_id: existingEntry._id},
							update: {
								$set: {
									maxComboCount: musicEntry.maxComboCount,
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
			await Chu3UserMusicDetail.bulkWrite(bulkOps);
		}

		// clear music cache
		deleteRedisKey("GetUserMusicApi", req.cardId);

		res.json({message: "Import complete", updated: bulkOps.length});
	});

export default chuniApiRouter;