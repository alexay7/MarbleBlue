import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserLoginBonusType} from "../types/userloginbonus.types.ts";

const chu3UserLoginBonusSchema = new Schema<Chu3UserLoginBonusType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	presetId: {type: Number, required: true},
	bonusCount: {type: Number, required: true, default: 0},
	lastUpdateDate: {type: Date, required: true, default: new Date(0)},
	isWatched: {type: Boolean, required: true, default: false},
	isFinished: {type: Boolean, required: true, default: false},
	hasReceivedToday: {type: Boolean, required: true, default: false},
});

chu3UserLoginBonusSchema.index({cardId: 1}, {unique: false});

export const Chu3UserLoginBonus = mongoose.model<Chu3UserLoginBonusType>("Chu3UserLoginBonus", chu3UserLoginBonusSchema);