import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameCourseType} from "../types/gamecourse.types.ts";

const sdvxGameCourseSchema = new Schema<SdvxGameCourseType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id:{type:Number, required:true},
	name:{type:String, required:true},
	seasonId:{type:Number},
	seasonName:{type:String},
	isNew:{type:String},
	type:{type:String},
	skillLevel:{type:String},
	skillType:{type:String},
	skillId:{type:String},
	matchingAssist:{type:String},
	clearRate:{type:Number},
	avgScore:{type:Number},
	track:{
		type:[{
			trackNo:{type:Number},
			musicId:{type:String},
			level:{type:String},
		}]
	},
});

export const SdvxGameCourseModel =  mongoose.model<SdvxGameCourseType>("SdvxGameCourse", sdvxGameCourseSchema);