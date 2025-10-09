import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameTrophyType} from "../types/gametrophy.types.ts";

const Chu3GameTrophySchema = new Schema<Chu3GameTrophyType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String},
	explanation: {type: String},
	rarity: {type: Number},
	unlockable: {type: Boolean},
});

export const Chu3GameTrophy = mongoose.model<Chu3GameTrophyType>("Chu3GameTrophy", Chu3GameTrophySchema);