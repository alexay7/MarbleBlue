import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserLoginBonusType} from "../types/userloginbonus.types.ts";

const gekiUserLoginBonusSchema = new Schema<GekiUserLoginBonusType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	bonusId: {type: Number, required: true},
	bonusCount: {type: Number, default: 0},
	lastUpdateDate: {type: Date, default: Date.now}
});

gekiUserLoginBonusSchema.index({userId: 1}, {unique: false});
gekiUserLoginBonusSchema.index({userId: 1, bonusId: 1}, {unique: true});

export const GekiUserLoginBonus = mongoose.model<GekiUserLoginBonusType>("GekiUserLoginBonus", gekiUserLoginBonusSchema);