import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserKopType} from "../types/userkop.types.ts";

const gekiUserKopSchema = new Schema<GekiUserKopType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	authKey: {type: String},
	kopId: {type: Number},
	areaId: {type: Number},
	totalTechScore: {type: Number, default: 0},
	totalPlatinumScore: {type: Number, default: 0},
	techRecordDate: {type: Date, default: null},
	isTotalTechNewRecord: {type: Boolean, default: false},
});

gekiUserKopSchema.index({userId: 1}, {unique: false});
gekiUserKopSchema.index({userId: 1, kopId: 1, areaId: 1}, {unique: true});

export const GekiUserKop = mongoose.model<GekiUserKopType>("GekiUserKop", gekiUserKopSchema);