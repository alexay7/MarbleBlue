import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameCardType} from "../types/gamecard.types.ts";

const gekiGameCardSchema = new Schema<GekiGameCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: Number, required: true, unique: true},
	cardName: {type: String, required: true},
	rarity: {type: String, required: true},
	attribute: {type: String},
	characterId: {type: Number},
	characterName: {type: String},
	seriesId: {type: Number},
	seriesName: {type: String},
	attackLevels: {type: [Number], default: []},
	skills: {type: [String], default: []}
});

export const GekiGameCard = mongoose.model<GekiGameCardType>("GekiGameCard", gekiGameCardSchema);