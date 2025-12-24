import type {Mai2GameShopItemType} from "../types/gameshopitem.types.ts";
import mongoose, {Schema, SchemaTypes} from "mongoose";

const Mai2GameShopItemSchema = new Schema<Mai2GameShopItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	itemId: {type: Number, required: true},
	itemType: {type: String, required: true},
	price: {type: Number, required: true},
	imagePath: {type: String, required: true},
	itemName: {type: String, required: true},
	quantity: {type: Number, required: true},
});

Mai2GameShopItemSchema.index({itemId: 1, itemType: 1}, {unique: true});

export const Mai2GameShopItem = mongoose.model<Mai2GameShopItemType>("Mai2GameShopItem", Mai2GameShopItemSchema);