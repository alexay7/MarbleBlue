import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserMusicDetailType} from "../types/usermusicdetail.types.ts";

const chu3UserMusicDetailSchema = new Schema<Chu3UserMusicDetailType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	musicId: {type: Number},
	level: {type: Number},
	playCount: {type: Number},
	scoreMax: {type: Number},
	missCount: {type: Number},
	maxComboCount: {type: Number},
	isFullCombo: {type: Boolean},
	isAllJustice: {type: Boolean},
	isSuccess: {type: Number},
	fullChain: {type: Number},
	maxChain: {type: Number},
	scoreRank: {type: Number},
	isLock: {type: Boolean},
	theoryCount: {type: Number},
	ext1: {type: Number},
});

chu3UserMusicDetailSchema.index({cardId: 1}, {unique:false});
chu3UserMusicDetailSchema.index({cardId: 1, musicId: 1, level: 1}, {unique: true});

export const Chu3UserMusicDetail = mongoose.model("Chu3UserMusicDetail", chu3UserMusicDetailSchema);
