import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserGachaType} from "../types/usergacha.types.ts";

const gekiUserGachaSchema = new Schema<GekiUserGachaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	gachaId: {type: Number, required: true},
	totalGachaCnt: {type: Number, default: 0},
	ceilingGachaCnt: {type: Number, default: 0},
	selectPoint: {type: Number, default: 0},
	useSelectPoint: {type: Number, default: 0},
	dailyGachaCnt: {type: Number, default: 0},
	fiveGachaCnt: {type: Number, default: 0},
	elevenGachaCnt: {type: Number, default: 0},
	dailyGachaDate: {type: Date, default: null},
});

gekiUserGachaSchema.index({userId: 1}, {unique: false});
gekiUserGachaSchema.index({userId: 1, gachaId: 1}, {unique: true});

export const GekiUserGacha = mongoose.model<GekiUserGachaType>("GekiUserGacha", gekiUserGachaSchema);