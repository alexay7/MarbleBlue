import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameCourseType} from "../types/gamecourse.types.ts";

const Chu3GameCourseSchema = new Schema<Chu3GameCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	difficulty: {type: Number},
	songs: [{
		musicId: {type: Number},
		musicName: {type: String},
		level: {type: Number},
	}],
});

export const Chu3GameCourse = mongoose.model<Chu3GameCourseType>("Chu3GameCourse", Chu3GameCourseSchema);