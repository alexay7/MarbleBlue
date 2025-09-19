import {Types} from "mongoose";

export type GekiUserTechEventType = {
    _id: Types.ObjectId;

    userId: string;

    eventId: bigint;
    totalTechScore: number;
    totalPlatinumScore: number;
    techRecordDate: Date;
    isRankingRewarded: boolean;
    isTotalTechNewRecord: boolean;
}