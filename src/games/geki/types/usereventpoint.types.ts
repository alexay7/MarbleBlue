import {Types} from "mongoose";

export type GekiUserEventPointType = {
    _id:Types.ObjectId;

    userId: string;

    eventId: bigint;
    point:number;
    isRankingRewarded:boolean;
}