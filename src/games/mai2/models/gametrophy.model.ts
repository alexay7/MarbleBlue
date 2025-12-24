import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2GameTrophyType} from "../types/gametrophy.types.ts";

const Mai2GameTrophySchema = new Schema<Mai2GameTrophyType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	explanation: {type: String, required: true},
	rarity: {type: String, required: true},
});

export const Mai2GameTrophy = mongoose.model<Mai2GameTrophyType>("Mai2GameTrophy", Mai2GameTrophySchema);