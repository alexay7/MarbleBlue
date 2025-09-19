import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserCourseType} from "../types/usercourse.types.ts";

const chu3UserCourseSchema = new Schema<Chu3UserCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	classId: {type: Number, required: true},
	courseId: {type: Number, required: true},
	eventId: {type: Number, required: true},
	isAllJustice: {type: Boolean, default: false},
	isClear: {type: Boolean, default: false},
	isFullCombo: {type: Boolean, default: false},
	isSuccess: {type: Boolean, default: false},
	lastPlayDate: {type: Date, default: Date.now},
	param1: {type: Number, default: 0},
	param2: {type: Number, default: 0},
	param3: {type: Number, default: 0},
	param4: {type: Number, default: 0},
	playCount: {type: Number, default: 0},
	theoryCount: {type: Number, default: 0},
	scoreMax: {type: Number, default: 0},
	scoreRank: {type: Number, default: 0},
	orderId: {type: Number, default: 0},
	playerRating: {type: Number, default: 0}
});

chu3UserCourseSchema.index({cardId: 1, courseId: 1}, {unique: true});

export const Chu3UserCourse = mongoose.model("Chu3UserCourse", chu3UserCourseSchema);