import {Types} from "mongoose";

export type GekiUserEventMusicType = {
    _id: Types.ObjectId;

    userId: string;

    eventId: bigint;
    type:number;
    musicId: number;
    level: number;
    techScoreMax: number;
    platinumScoreMax: number;
    techRecordDate:Date;
    isTechNewRecord:boolean;
}