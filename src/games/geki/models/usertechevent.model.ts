import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserTechEventType} from "../types/usertechevent.types.ts";

const gekiUserTechEventSchema = new Schema<GekiUserTechEventType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	eventId: {type: SchemaTypes.BigInt},
	totalTechScore: {type: Number, default: 0},
	totalPlatinumScore: {type: Number, default: 0},
	techRecordDate: {type: Date, default: null},
	isRankingRewarded: {type: Boolean, default: false},
	isTotalTechNewRecord: {type: Boolean, default: false},
});

gekiUserTechEventSchema.index({userId: 1}, {unique: false});
gekiUserTechEventSchema.index({userId: 1, eventId: 1}, {unique: true});

export const GekiUserTechEvent = mongoose.model<GekiUserTechEventType>("GekiUserTechEvent", gekiUserTechEventSchema);