import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2GameCardType} from "../types/gamecards.types.ts";

const mai2GameCardSchema = new Schema<Mai2GameCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true, unique: true},
	cardName: {type: String, required: true},
});

export const Mai2GameCardModel = mongoose.model<Mai2GameCardType>("Mai2GameCard", mai2GameCardSchema);