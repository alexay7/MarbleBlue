import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameMapConditionsType} from "../types/gamemapconditions.types.ts";

const Chu3GameMapConditionSchema = new Schema({
	type: {type: Number, required: true},
	conditionId: {type: Number, required: true},
	logicalOpe: {type: Number, required: true},
	startDate: {type: Date, required: false, default: null},
	endDate: {type: Date, required: false, default: null}
}, { _id : false });

const Chu3MapConditionsSchema = new Schema<Chu3GameMapConditionsType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	mapAreaId: {type: SchemaTypes.BigInt, required: true, unique: true},
	length: {type: Number, required: true},
	mapAreaConditionlist: {type: [Chu3GameMapConditionSchema], required: true}
});

export const Chu3GameMapConditions = mongoose.model<Chu3GameMapConditionsType>("Chu3GameMapConditions", Chu3MapConditionsSchema);