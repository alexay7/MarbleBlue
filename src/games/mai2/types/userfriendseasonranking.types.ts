import {Types} from "mongoose";

export type Mai2UserFriendSeasonRankingType = {
    _id: Types.ObjectId;

    userId: string;

    seasonId: number;
    point: number;
    rank: number;
    rewardGet: boolean;
    userName: string;
    recordDate: Date;
}