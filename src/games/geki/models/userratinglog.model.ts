import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserRatingLogType} from "../types/userratinglog.types.ts";

const gekiUserRatingLogSchema = new Schema<GekiUserRatingLogType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	highestRating: {type: Number, required: true},
	newHighestRating: {type: Number, required: true},
	dataVersion: {type: String, required: true},
});

gekiUserRatingLogSchema.index({userId: 1}, {unique: false});
gekiUserRatingLogSchema.index({userId: 1, dataVersion: 1}, {unique: true});

export const GekiUserRatingLog = mongoose.model<GekiUserRatingLogType>("GekiUserRatingLog", gekiUserRatingLogSchema);