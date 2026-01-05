import {Types} from "mongoose";

export type SdvxUserParamType = {
    _id:Types.ObjectId;

    cardId:string;
    version:number;

    type:string;
    id:string;
    param:string;
    count:number;
}