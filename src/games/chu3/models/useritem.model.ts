import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserItemType} from "../types/useritem.types.ts";

const chu3UserItemSchema = new Schema<Chu3UserItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	itemKind: {type: Number, required: true},
	itemId: {type: Number, required: true},
	stock: {type: Number, default: 1},
	isValid: {type: Boolean, default: true},
});

chu3UserItemSchema.index({cardId: 1, itemKind:1}, {unique:false});
chu3UserItemSchema.index({cardId: 1, itemKind:1, itemId: 1}, {unique: true});

export const Chu3UserItem = mongoose.model("Chu3UserItem", chu3UserItemSchema);