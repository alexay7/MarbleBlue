import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameCustomType} from "../types/gamecustom.types.ts";

const sdvxGameCustomSchema = new Schema<SdvxGameCustomType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	name:{type:String, required:true},
	variant:{type:String, required:true},
	type:{type:String, required:false},
	filename:{type:String, required:false},
});

sdvxGameCustomSchema.index({id:1}, {unique:true});

export const SdvxGameCustomModel =  mongoose.model<SdvxGameCustomType>("SdvxGameCustom", sdvxGameCustomSchema);