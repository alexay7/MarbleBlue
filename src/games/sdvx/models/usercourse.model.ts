import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { SdvxUserCourseType } from "../types/usercourse.types";

const sdvxUserCourseSchema = new Schema<SdvxUserCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	ssnid: {type: String, required: true},
	crsid: {type: String, required: true},
	st: {type: String},
	sc: {type: String},
	ex: {type: String},
	ct: {type: String},
	gr: {type: String},
	jr: {type: String},
	cr: {type: String},
	nr: {type: String},
	er: {type: String},
	cm: {type: String},
	ar: {type: String},
	tr: {type: Array},
	cnt: {type: Number},
});

sdvxUserCourseSchema.index({cardId:1, version:1});

export const SdvxUserCourseModel =  mongoose.model<SdvxUserCourseType>("SdvxUserCourse", sdvxUserCourseSchema);