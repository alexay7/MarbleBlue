import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameEventType} from "../types/gameevent.types.ts";

const sdvxGameEventSchema = new Schema<SdvxGameEventType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	version:{type:Number, required:true},
	type:{type:String, required:true},
	paramNum1:{type:Number},
	paramNum2:{type:Number},
	paramNum3:{type:Number},
	paramNum4:{type:Number},
	paramNum5:{type:Number},
	paramStr1:{type:String},
	paramStr2:{type:String},
	paramStr3:{type:String},
	paramStr4:{type:String},
	paramStr5:{type:String},
});

sdvxGameEventSchema.index({id:1, type:1, version:1});

export const SdvxGameEventModel =  mongoose.model<SdvxGameEventType>("SdvxGameEvent", sdvxGameEventSchema);