import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameMusicType} from "../types/gamemusic.types.ts";

const sdvxGameMusicSchema = new Schema<SdvxGameMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	level:{type:String, required:true},
	levelTag:{type:String, required:true},
	difficulty:{type:Number, required:true},
	limited:{type:String, required:true},

	title:{type:String},
	titleSort:{type:String},
	artist:{type:String},
	artistSort:{type:String},
	addedDate:{type:String},
	genre:{type:String},
	maxExscore:{type:Number},

	radar:{
		notes:{type:Number},
		peak:{type:Number},
		tsunami:{type:Number},
		tricky:{type:Number},
		handTrip:{type:Number},
		oneHand:{type:Number},
	}
});

sdvxGameMusicSchema.index({id:1, level:1}, {unique:true});

export const SdvxGameMusicModel =  mongoose.model<SdvxGameMusicType>("SdvxGameMusic", sdvxGameMusicSchema);