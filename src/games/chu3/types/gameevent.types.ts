import {Types} from "mongoose";

export type Chu3GameEventType = {
    _id:Types.ObjectId;

    id:bigint;
    type:number;
    name:string;
    enabled:boolean;
}