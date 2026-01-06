import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { SdvxUserCourseType } from "../types/usercourse.types";

const sdvxUserCourseSchema = new Schema<SdvxUserCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	ssnid: {type: String, required: true},
	crsid: {type: String, required: true},
	// god mode: 0 = off, 1 = on
	st: {type: String},
	// score sum
	sc: {type: String},
	// exscore sum
	ex: {type: String},
	// clear type: 1 = failed, 2 = cleared, 3 = UC, 4 = PUC
	ct: {type: String},
	// grade?
	gr: {type: String},
	// ?
	jr: {type: String},
	// ?
	cr: {type: String},
	// ?
	nr: {type: String},
	// ?
	er: {type: String},
	// ?
	cm: {type: String},
	// achieved rate * 100
	ar: {type: String},
	// ?
	tr: {type: Array},
	// play count
	cnt: {type: Number},
});

sdvxUserCourseSchema.index({cardId:1, version:1});

export const SdvxUserCourseModel =  mongoose.model<SdvxUserCourseType>("SdvxUserCourse", sdvxUserCourseSchema);