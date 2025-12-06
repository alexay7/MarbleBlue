import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameShopItemType} from "../types/shopitem.types.ts";

const Chu3GameShopItemSchema = new Schema<Chu3GameShopItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	shopId: {type: Number, required: true},
	itemId: {type: Number, required: true},
	itemType: {type: String, required: true},
	price: {type: Number, required: true},
	currencyType: {type: String, required: true, enum: ["coins", "points"]},
	imagePath: {type: String, required: true},
	itemName: {type: String, required: true},
});

export const Chu3GameShopItem = mongoose.model<Chu3GameShopItemType>("Chu3GameShopItem", Chu3GameShopItemSchema);