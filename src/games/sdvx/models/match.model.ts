import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxMatchType} from "../types/match.types.ts";

const sdvxMatchSchema = new Schema<SdvxMatchType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	createdAt: {type: Number, default: Date.now()},
	cVer: {type: String},
	pNum: {type: String},
	pRest: {type: String},
	filter: {type: String},
	mid: {type: String},
	sec: {type: String},
	port: {type: String},
	gip: {type: String},
	lip: {type: String},
	claim: {type: String},
	entryId: {type: String},
});

export const SdvxMatchModel =  mongoose.model<SdvxMatchType>("SdvxMatch", sdvxMatchSchema);