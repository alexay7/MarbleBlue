import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameUCType} from "../types/gameUC.types.ts";

const UCcourseSchema = new Schema({
	courseId: {type: Number, required: true},
	startDate: {type: Date, default: null},
	endDate: {type: Date, default: null},
}, {_id: false});

const UCconditionSchema = new Schema({
	type: {type: Number, required: true},
	conditionId: {type: Number, required: true},
	logicalOpe: {type: Number, required: true},
	startDate: {type: Date, default: null},
	endDate: {type: Date, default: null},
}, {_id: false});

const chu3GameUCSchema = new Schema<Chu3GameUCType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	unlockChallengeId: {type: Number, required: true, unique: true},
	conditionList: {type: [UCconditionSchema], default: []},
	courses: {type: [UCcourseSchema], default: []},
});

export const Chu3GameUC = mongoose.model("Chu3GameUC", chu3GameUCSchema);