import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameSkillType} from "../types/gameskill.types.ts";

const Chu3GameSkillSchema = new Schema<Chu3GameSkillType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	category: {type: Number, required: true},
});

export const Chu3GameSkill = mongoose.model<Chu3GameSkillType>("Chu3GameSkill", Chu3GameSkillSchema);