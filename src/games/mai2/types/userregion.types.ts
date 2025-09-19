import {Types} from "mongoose";

export type Mai2UserRegionType = {
    _id:Types.ObjectId;

    userId:string;

    regionId:number;
    playCount:number;
}