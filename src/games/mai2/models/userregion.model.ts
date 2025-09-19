import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserRegionType} from "../types/userregion.types.ts";

const mai2UserRegionSchema = new Schema<Mai2UserRegionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	regionId: {type: Number, required: true},
	playCount: {type: Number, default: 0},
});

export const Mai2UserRegionModel = mongoose.model<Mai2UserRegionType>("Mai2UserRegion", mai2UserRegionSchema);