import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { Mai2UserCharacterType } from "../types/usercharacter.types";

const mai2UserCharacterSchema = new Schema<Mai2UserCharacterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	characterId: {type: Number, required: true},
	point: {type: Number, default: 0},
	count: {type: Number, default: 0},
	level: {type: Number, default: 1},
	nextAwake: {type: Number, default: 0},
	nextAwakePercent: {type: Number, default: 0},
	favorite: {type: Boolean, default: false},
	awakening: {type: Number, default: 0},
	useCount: {type: Number, default: 0},
});

mai2UserCharacterSchema.index({userId: 1, characterId: 1}, {unique: true});

export const Mai2UserCharacterModel = mongoose.model<Mai2UserCharacterType>("Mai2UserCharacter", mai2UserCharacterSchema);