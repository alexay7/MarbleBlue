import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserGachaType} from "../types/usergacha.types.ts";

const chu3UserGachaSchema = new Schema<Chu3UserGachaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	gachaId: {type: Number, required: true},
	totalGachaCnt: {type: Number, default: 0},
	ceilingGachaCnt: {type: Number, default: 0},
	dailyGachaCnt: {type: Number, default: 0},
	fiveGachaCnt: {type: Number, default: 0},
	elevenGachaCnt: {type: Number, default: 0},
	dailyGachaDate: {type: Date, default: new Date(0)},
});

chu3UserGachaSchema.index({cardId: 1, gachaId: 1}, {unique: true});

export const Chu3UserGacha = mongoose.model<Chu3UserGachaType>("Chu3UserGacha", chu3UserGachaSchema);