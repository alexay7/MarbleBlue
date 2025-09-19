import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserCmissionProgressType, Chu3UserCmissionType} from "../types/usercmission.types.ts";

const chu3UserCmissionSchema = new Schema<Chu3UserCmissionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	missionId: {type: Number, required: true},
	point: {type: Number, default: 0},
});

chu3UserCmissionSchema.index({cardId: 1, missionId:1}, {unique:true});

export const Chu3UserCmission = mongoose.model("Chu3UserCmission", chu3UserCmissionSchema);

const chu3UserCmissionProgressSchema = new Schema<Chu3UserCmissionProgressType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	missionId: {type: Number, required: true},
	order: {type: Number, required: true},
	stage: {type: Number, required: true},
	progress: {type: Number, default: 0},
});

chu3UserCmissionProgressSchema.index({cardId: 1, missionId:1, order:1}, {unique:true});

export const Chu3UserCmissionProgress = mongoose.model("Chu3UserCmissionProgress", chu3UserCmissionProgressSchema);