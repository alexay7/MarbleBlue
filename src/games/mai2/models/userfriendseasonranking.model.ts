import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserFriendSeasonRankingType} from "../types/userfriendseasonranking.types.ts";

const mai2UserFriendSeasonRankingSchema = new Schema<Mai2UserFriendSeasonRankingType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	seasonId: {type: Number, required: true},
	point: {type: Number, default: 0},
	rank: {type: Number, default: 0},
	rewardGet: {type: Boolean, default: false},
	userName: {type: String, default: ""},
	recordDate: {type: Date, default: null},
});

mai2UserFriendSeasonRankingSchema.index({userId: 1, seasonId: 1}, {unique: true});

export const Mai2UserFriendSeasonRankingModel = mongoose.model<Mai2UserFriendSeasonRankingType>("Mai2UserFriendSeasonRanking", mai2UserFriendSeasonRankingSchema);