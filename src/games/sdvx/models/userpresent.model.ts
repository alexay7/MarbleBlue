import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxUserPresentType} from "../types/userpresent.types.ts";

const sdvxUserPresentSchema = new Schema<SdvxUserPresentType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	type:{type:String, required:true},
	id:{type:String, required:true},
	param:{type:String, required:true},
});

sdvxUserPresentSchema.index({cardId:1, version:1});

export const SdvxUserPresentModel =  mongoose.model<SdvxUserPresentType>("SdvxUserPresent", sdvxUserPresentSchema);