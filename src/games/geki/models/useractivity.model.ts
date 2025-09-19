import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserActivityType} from "../types/useractivity.types.ts";

const gekiUserActivitySchema = new Schema<GekiUserActivityType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	kind: {type: Number},
	id: {type: Number},
	sortNumber: {type: Number},
	param1: {type: Number},
	param2: {type: Number},
	param3: {type: Number},
	param4: {type: Number},
});

gekiUserActivitySchema.index({userId: 1, kind:1}, {unique:false});
gekiUserActivitySchema.index({userId: 1, kind: 1, id: 1}, {unique: true});

export const GekiUserActivity = mongoose.model("GekiUserActivity", gekiUserActivitySchema);