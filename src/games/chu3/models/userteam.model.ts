import type {Chu3UserTeamType} from "../types/team.types.ts";
import mongoose, {Schema, SchemaTypes} from "mongoose";

const chu3UserTeamSchema = new Schema<Chu3UserTeamType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	teamId: {type: Number, ref: "Chu3Team", required: true},

	currentPoints: {type: Number, default: 0},
	currentPeriod: {type: String, default: "2024-01"}
});

chu3UserTeamSchema.index({cardId: 1}, {unique:true});

export const Chu3UserTeam = mongoose.model("Chu3UserTeam", chu3UserTeamSchema);