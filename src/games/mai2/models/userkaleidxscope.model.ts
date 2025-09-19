import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserKaleidxScopeType} from "../types/userkaleidxscope.types.ts";

const mai2UserKaleidxScopeSchema = new Schema<Mai2UserKaleidxScopeType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	gateId: {type: Number, required: true},
	isGateFound: {type: Boolean, default: false},
	isKeyFound: {type: Boolean, default: false},
	isClear: {type: Boolean, default: false},
	totalRestLife: {type: Number, default: 0},
	totalAchievement: {type: Number, default: 0},
	totalDeluxscore: {type: Number, default: 0},
	bestAchievement: {type: Number, default: 0},
	bestDeluxscore: {type: Number, default: 0},
	bestAchievementDate: {type: Date, default: null},
	bestDeluxscoreDate: {type: Date, default: null},
	playCount: {type: Number, default: 0},
	clearDate: {type: Date, default: null},
	lastPlayDate: {type: Date, default: null},
	isInfoWatched: {type: Boolean, default: false},
});

mai2UserKaleidxScopeSchema.index({userId: 1, gateId: 1}, {unique: true});

export const Mai2UserKaleidxScopeModel = mongoose.model<Mai2UserKaleidxScopeType>("Mai2UserKaleidxScope", mai2UserKaleidxScopeSchema);