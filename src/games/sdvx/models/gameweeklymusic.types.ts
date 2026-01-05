import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameWeeklyMusicType} from "../types/gameweeklymusic.types.ts";

const sdvxGameWeeklyMusicSchema = new Schema<SdvxGameWeeklyMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	weekId: {type: Number, required: true},
	musicId: {type: Number, required: true},
});

sdvxGameWeeklyMusicSchema.index({weekId: 1, musicId: 1}, {unique: true});

export const SdvxGameWeeklyMusicModel =  mongoose.model<SdvxGameWeeklyMusicType>("SdvxGameWeeklyMusic", sdvxGameWeeklyMusicSchema);