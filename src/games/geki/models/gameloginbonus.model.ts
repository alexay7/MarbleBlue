import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameLoginBonusType} from "../types/gameloginbonus.types.ts";

const gekiGameLoginBonusItemSchema = new Schema({
	rewardId: {type: Number, required: true},
	itemName: {type: String, required: true},
	itemId: {type: Number, required: true},
	quantity: {type: Number, required: true},
	rarity: {type: String, required: true},
	type: {type: String, required: true},
}, {_id: false}
);

const gekiGameLoginBonusSchema = new Schema<GekiGameLoginBonusType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	bonusId: {type: Number, required: true, unique: true},
	bonusName: {type: String, required: true},
	items: {type: [gekiGameLoginBonusItemSchema], required: true},
	enabled: {type: Boolean, default: false},
});

export const GekiGameLoginBonus = mongoose.model<GekiGameLoginBonusType>("GekiGameLoginBonus", gekiGameLoginBonusSchema);