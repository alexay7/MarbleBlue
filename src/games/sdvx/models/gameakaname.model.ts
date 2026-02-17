import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameAkanameType} from "../types/gameakaname.types.ts";

const sdvxGameAkanameSchema = new Schema<SdvxGameAkanameType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	text:{type:String, required:true},
});

sdvxGameAkanameSchema.index({id:1}, {unique:true});

export const SdvxGameAkanameModel =  mongoose.model<SdvxGameAkanameType>("SdvxGameAkaname", sdvxGameAkanameSchema);