import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameGachaCardType, GekiGameGachaType} from "../types/gamegacha.types.ts";

const gekiGameGachaSchema = new Schema<GekiGameGachaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	gachaId: {type: Number, unique: true},
	gachaName: {type: String},
	type: {type: Number},
	kind: {type: Number},
	isCeiling: {type: Boolean, default: false},
	maxSelectPoint: {type: Number, default: 0},
});

export const GekiGameGacha = mongoose.model<GekiGameGachaType>("GekiGameGacha", gekiGameGachaSchema);

const gekiGameGachaCardSchema = new Schema<GekiGameGachaCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	gachaId: {type: Number, required: true},
	cardId: {type: SchemaTypes.BigInt, required: true},
	rarity: {type: Number, required: true},
	weight: {type: Number, required: true},
	isPickup: {type: Boolean, default: false},
	isSelect: {type: Boolean, default: false},
});

gekiGameGachaCardSchema.index({gachaId: 1}, {unique: false});

export const GekiGameGachaCard = mongoose.model<GekiGameGachaCardType>("GekiGameGachaCard", gekiGameGachaCardSchema);