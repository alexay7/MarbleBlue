import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserRegionType} from "../types/userregion.types.ts";

const gekiUserRegionSchema = new Schema<GekiUserRegionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	regionId: {type: Number, required: true},
	playCount: {type: Number, default: 0},
});

gekiUserRegionSchema.index({userId: 1}, {unique: false});
gekiUserRegionSchema.index({userId: 1, regionId: 1}, {unique: true});

export const GekiUserRegion = mongoose.model<GekiUserRegionType>("GekiUserRegion", gekiUserRegionSchema);