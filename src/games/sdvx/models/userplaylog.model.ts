import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { SdvxUserPlaylogType } from "../types/userplaylog.types";

const sdvxUserPlaylogSchema = new Schema<SdvxUserPlaylogType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},
	plus: {type: Boolean, default:false},

	trackId: {type: String, required: true},
	songId: {type: String, required: true},
	songType: {type: String, required: true},
	score: {type: String, required: true},
	exscore: {type: String, required: true},
	clearType: {type: String, required: true},
	scoreGrade: {type: String, required: true},
	maxChain: {type: String},
	just: {type: String},
	critical: {type: String},
	near: {type: String},
	error: {type: String},
	effectiveRate: {type: String},
	btnRate: {type: String},
	longRate: {type: String},
	volRate: {type: String},
	mode: {type: String},
	startOption: {type: String},
	gaugeType: {type: String},
	notesOption: {type: String},
	onlineNum: {type: String},
	localNum: {type: String},
	challengeType: {type: String},
	retryCnt: {type: String},
	judge: {type: String},
	dropFrame: {type: String},
	dropFrameMax: {type: String},
	dropCount: {type: String},
	etc: {type: String},
	mixId: {type: String},
	mixLike: {type: String},

	matching: [{
		code: {type: String},
		score: {type: String},
	}]
});

sdvxUserPlaylogSchema.index({cardId:1, version:1});

export const SdvxUserPlaylogModel =  mongoose.model<SdvxUserPlaylogType>("SdvxUserPlaylog", sdvxUserPlaylogSchema);