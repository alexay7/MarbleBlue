import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserActivityType, Mai2UserActType} from "../types/useractivity.types.ts";

const mai2UserActSchema = new Schema<Mai2UserActType>({
	kind: {type: Number},
	id: {type: Number},
	sortNumber: {type: SchemaTypes.BigInt},
	param1: {type: Number},
	param2: {type: Number},
	param3: {type: Number},
	param4: {type: Number},
}, {_id: false});

const mai2UserActivitySchema = new Schema<Mai2UserActivityType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true, unique: true},

	playList: {type: [mai2UserActSchema], default: []},
	musicList: {type: [mai2UserActSchema], default: []},
});

export const Mai2UserActivityModel = mongoose.model<Mai2UserActivityType>("Mai2UserActivity", mai2UserActivitySchema);