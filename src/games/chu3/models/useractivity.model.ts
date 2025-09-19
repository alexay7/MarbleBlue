import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserActivityType} from "../types/useractivity.types.ts";

const chu3UserActivitySchema = new Schema<Chu3UserActivityType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	kind: {type: Number},
	id: {type: Number},
	sortNumber: {type: Number},
	param1: {type: Number},
	param2: {type: Number},
	param3: {type: Number},
	param4: {type: Number},
});

chu3UserActivitySchema.index({cardId: 1, kind:1}, {unique:false});
chu3UserActivitySchema.index({cardId: 1, kind: 1, id: 1}, {unique: true});

export const Chu3UserActivity = mongoose.model("Chu3UserActivity", chu3UserActivitySchema);