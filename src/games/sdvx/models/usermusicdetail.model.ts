import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { SdvxUserMusicDetailType } from "../types/usermusicdetail.types";

const sdvxUserMusicDetailSchema = new Schema<SdvxUserMusicDetailType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},
	sdvxId: {type: String, required: true},
	name: {type: String, required: true},

	songId: {type: Number, required: true},
	songType: {type: Number, required: true},
	score: {type: Number, required: true},
	exscore: {type: Number, required: true},
	clearType: {type: Number, required: true},
	scoreGrade: {type: Number, required: true},

	btnRate: {type: Number},
	longRate: {type: Number},
	volRate: {type: Number},
});

sdvxUserMusicDetailSchema.index({cardId:1, version:1});

export const SdvxUserMusicDetailModel =  mongoose.model<SdvxUserMusicDetailType>("SdvxUserMusicDetail", sdvxUserMusicDetailSchema);