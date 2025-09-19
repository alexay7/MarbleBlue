import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserCardType} from "../types/usercard.types.ts";

const mai2UserCardSchema = new Schema<Mai2UserCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	cardId: {type: Number, required: true},
	cardTypeId: {type: Number},
	charaId: {type: Number},
	mapId: {type: Number},
	startDate: {type: Date, default: Date.now},
	endDate: {type: Date, default: null},
});

export const Mai2UserCardModel = mongoose.model<Mai2UserCardType>("Mai2UserCard", mai2UserCardSchema);