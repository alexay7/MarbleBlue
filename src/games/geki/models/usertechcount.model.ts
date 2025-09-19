import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserTechCountType} from "../types/usertechcount.types.ts";

const gekiUserTechCountSchema = new Schema<GekiUserTechCountType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	levelId: {type: Number, required: true},
	allBreakCount: {type: Number, default: 0},
	allBreakPlusCount: {type: Number, default: 0},
});

gekiUserTechCountSchema.index({userId: 1}, {unique: false});
gekiUserTechCountSchema.index({userId: 1, levelId: 1}, {unique: true});

export const GekiUserTechCount = mongoose.model<GekiUserTechCountType>("GekiUserTechCount", gekiUserTechCountSchema);