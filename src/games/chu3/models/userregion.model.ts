import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserRegionType} from "../types/userregion.types.ts";

const chu3UserRegionSchema = new Schema<Chu3UserRegionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	regionId: {type: Number, required: true},
	playCount: {type: Number, required: true, default: 0},
});

chu3UserRegionSchema.index({cardId: 1}, {unique: false});
chu3UserRegionSchema.index({cardId: 1, regionId: 1}, {unique: true});

export const Chu3UserRegion = mongoose.model<Chu3UserRegionType>("Chu3UserRegion", chu3UserRegionSchema);