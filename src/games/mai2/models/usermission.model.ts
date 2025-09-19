import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserMissionType} from "../types/usermission.types.ts";

const mai2UserMissionSchema = new Schema<Mai2UserMissionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	type:{type: Number},
	difficulty:{type: Number},
	targetGenreId:{type: Number},
	targetGenreTableId:{type: Number},
	conditionGenreId:{type: Number},
	conditionGenreTableId:{type: Number},
	clearFlag:{type: Boolean, default: false},
});

export const Mai2UserMissionModel = mongoose.model<Mai2UserMissionType>("Mai2UserMission", mai2UserMissionSchema);