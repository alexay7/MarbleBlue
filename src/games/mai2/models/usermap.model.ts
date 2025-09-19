import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserMapType} from "../types/usermap.types.ts";

const mai2UserMapSchema = new Schema<Mai2UserMapType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	mapId: {type: Number, required: true},
	distance: {type: Number, default: 0},
	isLock: {type: Boolean, default: true},
	isClear: {type: Boolean, default: false},
	isComplete: {type: Boolean, default: false},
	unlockFlag: {type: Number, default: 0},
});

mai2UserMapSchema.index({userId: 1, mapId: 1}, {unique: true});

export const Mai2UserMapModel = mongoose.model<Mai2UserMapType>("Mai2UserMap", mai2UserMapSchema);