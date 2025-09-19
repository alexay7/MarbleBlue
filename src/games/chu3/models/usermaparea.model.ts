import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserMapAreaType} from "../types/usermaparea.types.ts";

const chu3UserMapAreaSchema = new Schema<Chu3UserMapAreaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	mapAreaId: {type: Number, required: true},
	position: {type: Number, required: true},
	isClear: {type: Boolean, default: false},
	rate: {type: Number, default: 0},
	statusCount: {type: Number, default: 0},
	remainGridCount: {type: Number, default: 0},
	isLocked: {type: Boolean, default: true},
});

chu3UserMapAreaSchema.index({cardId: 1, mapAreaId: 1}, {unique: true});

export const Chu3UserMapArea = mongoose.model("Chu3UserMapArea", chu3UserMapAreaSchema);