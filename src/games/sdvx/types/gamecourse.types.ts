import {Types} from "mongoose";

export type SdvxGameCourseType = {
    _id: Types.ObjectId;

    id:number;
    name:string;
    seasonId:number;
    seasonName:string;
    isNew: string;
    type:string;
    skillLevel:string;
    skillType:string;
    skillId:string;
    matchingAssist:string;
    clearRate:number;
    avgScore:number;
    track:{
        trackNo:number;
        musicId:string;
        level:string;
    }[]
}