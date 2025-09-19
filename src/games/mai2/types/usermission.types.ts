import {Types} from "mongoose";

export type Mai2UserMissionType = {
    _id:Types.ObjectId;

    userId: string;

    type:number;
    difficulty:number
    targetGenreId:number;
    targetGenreTableId:number;
    conditionGenreId:number
    conditionGenreTableId:number;
    clearFlag:boolean;
}