import {Types} from "mongoose";

export type Mai2GameEventType = {
    _id:Types.ObjectId;

    id:bigint;
    type:number;
    startDate:Date;
    endDate:Date;
    enable:boolean;
    disableArea:string;
}