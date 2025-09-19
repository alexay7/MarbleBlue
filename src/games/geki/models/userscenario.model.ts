import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserScenarioType} from "../types/userscenario.types.ts";

const gekiUserScenarioSchema = new Schema<GekiUserScenarioType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	scenarioId: {type: Number, required: true},
	playCount: {type: Number, default: 0},
});

gekiUserScenarioSchema.index({userId: 1}, {unique: false});
gekiUserScenarioSchema.index({userId: 1, scenarioId: 1}, {unique: true});

export const GekiUserScenario = mongoose.model<GekiUserScenarioType>("GekiUserScenario", gekiUserScenarioSchema);