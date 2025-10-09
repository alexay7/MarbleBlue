import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameMapType} from "../types/gamemap.types.ts";

const Chu3GameMapSchema = new Schema<Chu3GameMapType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	series: {type: String, required: true},
	seriesId: {type: Number, required: true},
	category: {type: String, required: true},
	rewards: {
		type: [{
			mapAreaId: {type: Number, required: true},
			rewardId: {type: Number, required: true},
			rewardName: {type: String, required: true},
		}],
		required: true,
		default: [],
	},
});

export const Chu3GameMap = mongoose.model<Chu3GameMapType>("Chu3GameMap", Chu3GameMapSchema);