import {Types} from "mongoose";

export type Chu3UserRegionType = {
    _id:Types.ObjectId;

    cardId:string;

    regionId:number;
    playCount:number;
}