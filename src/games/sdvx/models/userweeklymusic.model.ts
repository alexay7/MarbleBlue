import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxUserWeeklyMusicType} from "../types/userweeklymusic.types.ts";

const sdvxUserWeeklyMusicSchema = new Schema<SdvxUserWeeklyMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	weekId: {type: String, required: true},
	musicId: {type: String, required: true},
	musicType: {type: String, required: true},
	exscore: {type: String},
	rank: {type: String},
});

sdvxUserWeeklyMusicSchema.index({cardId:1, version:1});

export const SdvxUserWeeklyMusicModel =  mongoose.model<SdvxUserWeeklyMusicType>("SdvxUserWeeklyMusic", sdvxUserWeeklyMusicSchema);