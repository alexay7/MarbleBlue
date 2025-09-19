import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserCourseType} from "../types/usercourse.types.ts";

const mai2UserCourseSchema = new Schema<Mai2UserCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	courseId: {type: Number, required: true},
	isLastClear: {type: Boolean, default: false},
	totalRestlife: {type: Number, default: 0},
	totalAchievement: {type: Number, default: 0},
	totalDeluxscore: {type: Number, default: 0},
	playCount: {type: Number, default: 0},
	clearDate: {type: Date, default: null},
	lastPlayDate: {type: Date, default: Date.now},
	bestAchievement: {type: Number, default: 0},
	bestAchievementDate: {type: Date, default: null},
	bestDeluxscore: {type: Number, default: 0},
	bestDeluxscoreDate: {type: Date, default: null},
});

mai2UserCourseSchema.index({userId: 1, courseId: 1}, {unique: true});

export const Mai2UserCourseModel = mongoose.model<Mai2UserCourseType>("Mai2UserCourse", mai2UserCourseSchema);