import {Types} from "mongoose";

export type SdvxGameEventType = {
    _id: Types.ObjectId;

    id:number;
    version:number;
    type:string;
    paramNum1:number;
    paramNum2:number;
    paramNum3:number;
    paramNum4:number;
    paramNum5:number;
    paramStr1:string;
    paramStr2:string;
    paramStr3:string;
    paramStr4:string;
    paramStr5:string;
}