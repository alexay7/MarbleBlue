import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserUCType} from "../types/userUC.types.ts";

const chu3UserUCSchema = new Schema<Chu3UserUCType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	unlockChallengeId: {type: Number, required: true},
	status: {type: Number, required: true, default: 0},
	clearCourseId: {type: Number, required: true, default: 0},
	conditionType: {type: Number, required: true, default: 0},
	score: {type: Number, required: true, default: 0},
	life: {type: Number, required: true, default: 0},
	clearDate: {type: Date, required: true, default: new Date(0)},
});

chu3UserUCSchema.index({cardId: 1, unlockChallengeId:1}, {unique: true});

export const Chu3UserUC = mongoose.model<Chu3UserUCType>("Chu3UserUC", chu3UserUCSchema);