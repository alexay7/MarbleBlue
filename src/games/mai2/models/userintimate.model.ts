import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserIntimateType} from "../types/userintimate.types.ts";

const mai2UserIntimateSchema = new Schema<Mai2UserIntimateType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	partnerId: {type: Number, required: true},
	intimateLevel: {type: Number, default: 1},
	intimateCountRewarded: {type: Number, default: 0},
});

mai2UserIntimateSchema.index({userId: 1, partnerId: 1}, {unique: true});

export const Mai2UserIntimateModel = mongoose.model<Mai2UserIntimateType>("Mai2UserIntimate", mai2UserIntimateSchema);