import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameGachaCardType, Chu3GameGachaType} from "../types/gamegacha.types";

const chu3GachaCardSchema = new Schema<Chu3GameGachaCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	gachaId: {type: Number, required: true},
	cardId: {type: SchemaTypes.BigInt, required: true},
	rarity: {type: Number},
	weight: {type: Number},
	isPickup: {type: Boolean},
	characterId: {type: Number},
}, {_id:false});

const chu3GachaSchema = new Schema<Chu3GameGachaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	gachaId: {type: Number, required: true, unique: true},
	gachaName: {type: String},
	type: {type: Number},
	kind: {type: Number},
	isCeiling: {type: Boolean},
	ceilingCnt: {type: Number},
	changeRateCnt: {type: Number},
	changeRateCnt2: {type: Number},
	startDate: {type: Date},
	endDate: {type: Date},
	noticeStartDate: {type: Date},
	noticeEndDate: {type: Date},
	cards: {type: [chu3GachaCardSchema], default: []},
});

export const Chu3GameGacha = mongoose.model<Chu3GameGachaType>("Chu3GameGacha", chu3GachaSchema);