import mongoose, {Schema, SchemaTypes } from "mongoose";
import type { SdvxUserParamType } from "../types/userparam.types";

const sdvxUserParamSchema = new Schema<SdvxUserParamType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	type:{type:String, required:true},
	id:{type:String, required:true},
	param:{type:String, required:true},
	count:{type:Number, required:true},
});

sdvxUserParamSchema.index({cardId:1, version:1});

export const SdvxUserParamModel =  mongoose.model<SdvxUserParamType>("SdvxUserParam", sdvxUserParamSchema);