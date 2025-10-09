import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameCMissionType} from "../types/gamecmission.types.ts";

const Chu3GameCMissionSchema = new Schema<Chu3GameCMissionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	characterId: {type: Number, required: true, ref: "Chu3GameCharacter"},
	rewards: [{
		rewardId: {type: Number, required: true},
		rewardName: {type: String, required: true},
		points: {type: Number, required: true},
	}],
});

export const Chu3GameCMission = mongoose.model<Chu3GameCMissionType>("Chu3GameCMission", Chu3GameCMissionSchema);