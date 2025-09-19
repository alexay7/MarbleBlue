import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserDeckType} from "../types/userdeck.types.ts";

const gekiUserDeckSchema = new Schema<GekiUserDeckType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	deckId: {type: Number, required: true},
	cardId1: {type: Number, required: true},
	cardId2: {type: Number, required: true},
	cardId3: {type: Number, required: true},
});

gekiUserDeckSchema.index({userId: 1}, {unique: false});
gekiUserDeckSchema.index({userId: 1, deckId: 1}, {unique: true});

export const GekiUserDeck = mongoose.model<GekiUserDeckType>("GekiUserDeck", gekiUserDeckSchema);