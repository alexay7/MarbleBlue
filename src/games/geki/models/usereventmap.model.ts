import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserEventMapType} from "../types/usereventmap.types.ts";

const gekiUserEventMapSchema = new Schema<GekiUserEventMapType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	eventId: {type: SchemaTypes.BigInt, required: true},
	mapId: {type: Number, required: true},
	mapData: {type: String, required: true},
	totalPoint: {type: Number, default: 0},
	totalUsePoint: {type: Number, default: 0},
});

gekiUserEventMapSchema.index({userId: 1}, {unique: false});
gekiUserEventMapSchema.index({userId: 1, eventId: 1, mapId: 1}, {unique: true});

export const GekiUserEventMap = mongoose.model<GekiUserEventMapType>("GekiUserEventMap", gekiUserEventMapSchema);