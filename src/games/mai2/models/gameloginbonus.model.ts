import type {Mai2GameLoginBonusType} from "../types/gameloginbonus.ts";
import mongoose, {Schema} from "mongoose";

const Mai2GameLoginBonusSchema = new Schema<Mai2GameLoginBonusType>({
	_id: {type: Schema.Types.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	type: {type: String, required: true},
	rewardId: {type: Number, required: true},
	rewardName: {type: String, required: true},
});

export const Mai2GameLoginBonus = mongoose.model<Mai2GameLoginBonusType>("Mai2GameLoginBonus", Mai2GameLoginBonusSchema);