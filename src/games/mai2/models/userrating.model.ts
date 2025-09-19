import type {Mai2UserRateType, Mai2UserRatingType, Mai2UserUdemaeType} from "../types/userrating.types.ts";
import mongoose, {Schema, SchemaTypes} from "mongoose";

const mai2UserRateSchema = new Schema<Mai2UserRateType>({
	musicId: {type: Number, required: true},
	level: {type: Number, required: true},
	romVersion: {type: Number, required: true},
	achievement: {type: Number, default: 0},
}, {_id: false});

const udemaeSchema = new Schema<Mai2UserUdemaeType>({
	rate: {type: Number, default: 0},
	maxRate: {type: Number, default: 0},
	classValue: {type: Number, default: 0},
	maxClassValue: {type: Number, default: 0},
	totalWinNum: {type: Number, default: 0},
	totalLoseNum: {type: Number, default: 0},
	maxWinNum: {type: Number, default: 0},
	maxLoseNum: {type: Number, default: 0},
	winNum: {type: Number, default: 0},
	loseNum: {type: Number, default: 0},
	npcTotalWinNum: {type: Number, default: 0},
	npcTotalLoseNum: {type: Number, default: 0},
	npcMaxWinNum: {type: Number, default: 0},
	npcMaxLoseNum: {type: Number, default: 0},
	npcWinNum: {type: Number, default: 0},
	npcLoseNum: {type: Number, default: 0},
}, {_id: false});

const mai2UserRatingSchema = new Schema<Mai2UserRatingType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true, unique: true},

	rating: {type: Number, default: 0},
	ratingList: {type: [mai2UserRateSchema], default: []},
	newRatingList: {type: [mai2UserRateSchema], default: []},
	nextRatingList: {type: [mai2UserRateSchema], default: []},
	nextNewRatingList: {type: [mai2UserRateSchema], default: []},
	udemae: {type: udemaeSchema, default: () => ({})},
});

export const Mai2UserRatingModel = mongoose.model<Mai2UserRatingType>("Mai2UserRating", mai2UserRatingSchema);