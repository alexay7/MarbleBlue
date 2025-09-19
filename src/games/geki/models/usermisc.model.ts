import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserMiscType, GekiUserRatingType, GekiUserRivalType} from "../types/usermisc.types.ts";

const userRatingSchema = new Schema<GekiUserRatingType>({
	musicId: {type: Number, required: true},
	difficultId: {type: Number, required: true},
	romVersionCode: {type: Number, required: true},
	score: {type: Number, required: true},
	platinumScoreMax: {type: Number},
	platinumScoreStar: {type: Number},
}, {_id:false});

const userRivalSchema = new Schema<GekiUserRivalType>({
	rivalUserId: {type: SchemaTypes.BigInt, required: true},
	rivalUserName: {type: String, required: true},
	ktAlias: {type: String},
}, {_id:false});

const gekiUserMiscSchema = new Schema<GekiUserMiscType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	userRecentRatingList: {type: [userRatingSchema], default: []},
	userBpBaseList: {type: [userRatingSchema], default: []},
	userRatingBaseBestNewList: {type: [userRatingSchema], default: []},
	userRatingBaseBestList: {type: [userRatingSchema], default: []},
	userRatingBaseHotList: {type: [userRatingSchema], default: []},
	userRatingBaseNextNewList: {type: [userRatingSchema], default: []},
	userRatingBaseNextList: {type: [userRatingSchema], default: []},
	userRatingBaseHotNextList: {type: [userRatingSchema], default: []},
	userNewRatingBasePScoreList: {type: [userRatingSchema], default: []},
	userNewRatingBaseBestList: {type: [userRatingSchema], default: []},
	userNewRatingBaseBestNewList: {type: [userRatingSchema], default: []},
	userNewRatingBaseNextPScoreList: {type: [userRatingSchema], default: []},
	userNewRatingBaseNextBestList: {type: [userRatingSchema], default: []},
	userNewRatingBaseNextBestNewList: {type: [userRatingSchema], default: []},

	rivalList: {type: [userRivalSchema], default: []},
});

gekiUserMiscSchema.index({userId: 1}, {unique:true});

export const GekiUserMisc = mongoose.model("GekiUserMisc", gekiUserMiscSchema);