import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameTrophyType} from "../types/gametrophy.types.ts";

const gekiGameEventSchema = new Schema<GekiGameTrophyType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	trophyId: {type: Number, required: true, unique: true},
	trophyName: {type: String, required: true},
	description: {type: String, required: true},
	rarity: {type: "String", required: true},
});

export const GekiGameTrophy = mongoose.model<GekiGameTrophyType>("GekiGameTrophy", gekiGameEventSchema);