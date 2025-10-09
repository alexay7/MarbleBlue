import mongoose, {Schema} from "mongoose";
import type {Chu3TeamType} from "../types/team.types.ts";

const chu3Team = new Schema<Chu3TeamType>({
	teamId: {type: Number, required:true, unique: true},
	teamName: {type: String, required: true, unique: true},
	ownerId: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true},
	lastMonthPoints: {type: Number, required: true, default: 0},
});

export const Chu3Team = mongoose.model("Chu3Team", chu3Team);