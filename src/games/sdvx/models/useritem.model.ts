import mongoose, { Schema, SchemaTypes } from "mongoose";
import type { SdvxUserItemType } from "../types/useritem.types";

const sdvxUserItemSchema = new Schema<SdvxUserItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	type:{type:String, required:true},
	id:{type:String, required:true},
	param:{type:String, required:true},
});

sdvxUserItemSchema.index({cardId:1, version:1});

export const SdvxUserItemModel =  mongoose.model<SdvxUserItemType>("SdvxUserItem", sdvxUserItemSchema);