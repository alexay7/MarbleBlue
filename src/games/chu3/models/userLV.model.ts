import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserLVType} from "../types/userLV.types.ts";

const chu3UserLVSchema = new Schema<Chu3UserLVType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	linkedVerseId: {type: String, required: true},
	progress: {type: String},
	statusOpen: {type: String},
	statusUnlock: {type: String},
	isFirstClear: {type: Boolean, default: false},
	numClear: {type: Number, default: 0},
	clearCourseId: {type: Number, default: 0},
	clearCourseLevel: {type: Number, default: 0},
	clearScore: {type: Number, default: 0},
	clearDate: {type: Date, default: new Date(0)},
	clearUserId1: {type: String, default: ""},
	clearUserId2: {type: String, default: ""},
	clearUserId3: {type: String, default: ""},
	clearUserName0: {type: String, default: ""},
	clearUserName1: {type: String, default: ""},
	clearUserName2: {type: String, default: ""},
	clearUserName3: {type: String, default: ""},
});

chu3UserLVSchema.index({cardId: 1, linkedVerseId:1}, {unique: true});

export const Chu3UserLV = mongoose.model<Chu3UserLVType>("Chu3UserLV", chu3UserLVSchema);