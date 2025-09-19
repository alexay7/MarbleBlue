import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserTradeItemType} from "../types/usertradeitem.types.ts";

const gekiUserTradeItemSchema = new Schema<GekiUserTradeItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	chapterId: {type: Number},
	tradeItemId: {type: Number, default: 0},
	tradeCount: {type: Number, default: 0},
});

gekiUserTradeItemSchema.index({userId: 1}, {unique: false});
gekiUserTradeItemSchema.index({userId: 1, chapterId: 1, tradeItemId: 1}, {unique: true});

export const GekiUserTradeItem = mongoose.model<GekiUserTradeItemType>("GekiUserTradeItem", gekiUserTradeItemSchema);