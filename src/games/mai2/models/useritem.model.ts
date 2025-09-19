import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserItemType} from "../types/useritem.types.ts";

const mai2UserItemSchema = new Schema<Mai2UserItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	itemKind: {type: Number, required: true},
	itemId: {type: Number, required: true},
	stock: {type: Number, default: 0},
	isValid: {type: Boolean, default: true},
});

mai2UserItemSchema.index({userId: 1, itemKind: 1, itemId: 1}, {unique: true});

export const Mai2UserItemModel = mongoose.model<Mai2UserItemType>("Mai2UserItem", mai2UserItemSchema);