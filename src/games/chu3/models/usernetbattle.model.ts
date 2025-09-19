import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserNetBattleDataType, Chu3UserNetBattleLogType} from "../types/userNetBattle.types.ts";

// _id: Types.ObjectId;
//
// cardId: string;
//
// recentNBSelectMusicList: { musicId: number }[],
//     isRankUpChallengeFailed: boolean,
//     highestBattleRankId: number,
//     battleIconId: number,
//     battleIconNum: number,
//     avatarEffectPoint: number

const chu3UserNetBattleRecentSongSchema = new Schema<{ musicId: number }>({
	musicId: {type: Number}
}, {_id: false});

const chu3UserNetBattleDataSchema = new Schema<Chu3UserNetBattleDataType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	recentNBSelectMusicList: {type: [chu3UserNetBattleRecentSongSchema], default: []},
	isRankUpChallengeFailed: {type: Boolean},
	highestBattleRankId: {type: Number},
	battleIconId: {type: Number},
	battleIconNum: {type: Number},
	avatarEffectPoint: {type: Number},
});

chu3UserNetBattleDataSchema.index({cardId: 1}, {unique: true});

export const Chu3UserNetBattleData = mongoose.model<Chu3UserNetBattleDataType>("Chu3UserNetBattleData", chu3UserNetBattleDataSchema);

const chu3UserNetBattleLogSchema = new Schema<Chu3UserNetBattleLogType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	roomId: {type: Number},
	track: {type: Number},
	selectUserId: {type: String},
	selectUserName: {type: String},
	opponentUserId1: {type: String},
	opponentUserId2: {type: String},
	opponentUserId3: {type: String},
	opponentUserName1: {type: String},
	opponentUserName2: {type: String},
	opponentUserName3: {type: String},
	opponentRegionId1: {type: Number},
	opponentRegionId2: {type: Number},
	opponentRegionId3: {type: Number},
	opponentRating1: {type: Number},
	opponentRating2: {type: Number},
	opponentRating3: {type: Number},
	opponentBattleRankId1: {type: Number},
	opponentBattleRankId2: {type: Number},
	opponentBattleRankId3: {type: Number},
	opponentClassEmblemMedal1: {type: Number},
	opponentClassEmblemMedal2: {type: Number},
	opponentClassEmblemMedal3: {type: Number},
	opponentClassEmblemBase1: {type: Number},
	opponentClassEmblemBase2: {type: Number},
	opponentClassEmblemBase3: {type: Number},
	opponentScore1: {type: Number},
	opponentScore2: {type: Number},
	opponentScore3: {type: Number},
	opponentCharaIllustId1: {type: Number},
	opponentCharaIllustId2: {type: Number},
	opponentCharaIllustId3: {type: Number},
	opponentCharaLv1: {type: Number},
	opponentCharaLv2: {type: Number},
	opponentCharaLv3: {type: Number},
	opponentRatingEffectColorId1: {type: Number},
	opponentRatingEffectColorId2: {type: Number},
	opponentRatingEffectColorId3: {type: Number},
	battleRuleId: {type: Number},
});

chu3UserNetBattleLogSchema.index({cardId: 1}, {unique: false});

export const Chu3UserNetBattleLog = mongoose.model<Chu3UserNetBattleLogType>("Chu3UserNetBattleLog", chu3UserNetBattleLogSchema);

