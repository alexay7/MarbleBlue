import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxUserArenaType} from "../types/userarena.types.ts";

const sdvxUserArenaSchema = new Schema<SdvxUserArenaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	season:{type:String, required:true},
	rankPoint:{type:Number},
	shopPoint:{type:Number},
	ultimateRate:{type:Number},
	ultimateRankNum:{type:String},
	megamixRate:{type:Number},
	rankPlayCnt:{type:Number},
	ultimatePlayCnt:{type:Number},
});

sdvxUserArenaSchema.index({cardId:1, version:1});

export const SdvxUserArenaModel =  mongoose.model<SdvxUserArenaType>("SdvxUserArena", sdvxUserArenaSchema);