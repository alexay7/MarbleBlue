import {Types} from "mongoose";

export type Chu3GameLoginBonusType = {
    _id:Types.ObjectId;

    presetId:number;
    presetName:string;
    loginBonusId:number;
    loginBonusName:string;
    presentId:number;
    presentName:string;
    itemNum:number;
    needLoginDayCount:number;
    loginBonusCategoryType:number;
    opt:bigint;
}