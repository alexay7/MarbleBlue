import {Types} from "mongoose";

export type SdvxUserItemType = {
    _id:Types.ObjectId;

    cardId:string;
    version:number;

    type:string;
    id:string;
    param:string;
}