import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { Chu3GameLoginBonusType } from "../types/gameloginbonus.types.ts";

const chu3LoginBonusSchema = new Schema<Chu3GameLoginBonusType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	presetId: {type: Number},
	presetName: {type: String},
	loginBonusId: {type: Number},
	loginBonusName: {type: String},
	presentId: {type: Number},
	presentName: {type: String},
	itemNum: {type: Number},
	needLoginDayCount: {type: Number},
	loginBonusCategoryType: {type: Number},
	opt: {type: SchemaTypes.BigInt},
});

chu3LoginBonusSchema.index({presetId: 1}, {unique: false});
chu3LoginBonusSchema.index({cardId: 1, presetId: 1}, {unique: false});
chu3LoginBonusSchema.index({cardId: 1, presetId: 1, needLoginDayCount:1 }, {unique: false});

export const Chu3GameLoginBonus = mongoose.model<Chu3GameLoginBonusType>("Chu3GameLoginBonus", chu3LoginBonusSchema);