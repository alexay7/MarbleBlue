import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserLoginBonusType} from "../types/userloginbonus.types.ts";

const mai2UserLoginBonusSchema = new Schema<Mai2UserLoginBonusType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	bonusId: {type: Number, required: true},
	point: {type: Number, default: 0},
	isCurrent: {type: Boolean, default: false},
	isComplete: {type: Boolean, default: false},
});

mai2UserLoginBonusSchema.index({userId: 1, bonusId: 1}, {unique: true});

export const Mai2UserLoginBonusModel = mongoose.model<Mai2UserLoginBonusType>("Mai2UserLoginBonus", mai2UserLoginBonusSchema);