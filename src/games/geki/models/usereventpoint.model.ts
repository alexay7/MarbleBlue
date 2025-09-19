import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { GekiUserEventPointType } from "../types/usereventpoint.types.ts";

const gekiUserEventPointSchema = new Schema<GekiUserEventPointType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	eventId: {type: SchemaTypes.BigInt, required: true},
	point: {type: Number, default: 0},
	isRankingRewarded: {type: Boolean, default: false},
});

gekiUserEventPointSchema.index({userId: 1}, {unique: false});
gekiUserEventPointSchema.index({userId: 1, eventId: 1}, {unique: true});

export const GekiUserEventPoint = mongoose.model<GekiUserEventPointType>("GekiUserEventPoint", gekiUserEventPointSchema);