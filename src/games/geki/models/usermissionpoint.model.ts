import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserMissionPointType} from "../types/usermissionpoint.types.ts";

const gekiUserMissionPointSchema = new Schema<GekiUserMissionPointType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	eventId: {type: SchemaTypes.BigInt, required: true},
	point: {type: Number, default: 0},
});

gekiUserMissionPointSchema.index({userId: 1}, {unique: false});
gekiUserMissionPointSchema.index({userId: 1, eventId: 1}, {unique: true});

export const GekiUserMissionPoint = mongoose.model<GekiUserMissionPointType>("GekiUserMissionPoint", gekiUserMissionPointSchema);