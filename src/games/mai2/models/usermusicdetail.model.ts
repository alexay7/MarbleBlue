import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserMusicDetailType} from "../types/usermusicdetail.types.ts";

const mai2UserMusicDetailSchema = new Schema<Mai2UserMusicDetailType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	musicId: {type: Number, required: true},
	level: {type: Number, required: true},
	playCount: {type: Number, default: 0},
	achievement: {type: Number, default: 0},
	comboStatus: {type: Number, default: 0},
	syncStatus: {type: Number, default: 0},
	deluxscoreMax: {type: Number, default: 0},
	scoreRank: {type: Number, default: 0},
	extNum1: {type: Number, default: 0},
});

mai2UserMusicDetailSchema.index({userId: 1, musicId: 1, level: 1}, {unique: true});

export const Mai2UserMusicDetailModel = mongoose.model<Mai2UserMusicDetailType>("Mai2UserMusicDetail", mai2UserMusicDetailSchema);