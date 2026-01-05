import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameValgenType} from "../types/gamevalgen.types.ts";

const sdvxGameValgenSchema = new Schema<SdvxGameValgenType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true},
	name: {type: String, required: true},

	crew: {type: [Number]},
	stamp: {type: [Number]},
	subbg: {type: [Number]},
	bgm: {type: [Number]},
	nemsys: {type: [Number]},
	sysbg: {type: [Number]}
});

export const SdvxGameValgenModel =  mongoose.model<SdvxGameValgenType>("SdvxGameValgen", sdvxGameValgenSchema);