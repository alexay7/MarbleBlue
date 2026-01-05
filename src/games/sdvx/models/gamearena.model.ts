import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameArenaType} from "../types/gamearena.types.ts";

const sdvxGameArenaItemSchema = new Schema({
	catalogId:{type:String, required:true},
	catalogType:{type:String, required:true},
	price:{type:Number, required:true},
	itemType:{type:String, required:true},
	itemId:{type:String, required:true},
	param:{type:String, required:true},
}, {_id: false});

const sdvxGameArenaSchema = new Schema<SdvxGameArenaType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	rule:{type:String, required:true},
	rankMatchTarget:{type:String, required:true},
	catalog:{type:[sdvxGameArenaItemSchema], required:true},
});

sdvxGameArenaSchema.index({id:1}, {unique:true});

export const SdvxGameArenaModel =  mongoose.model<SdvxGameArenaType>("SdvxGameArena", sdvxGameArenaSchema);