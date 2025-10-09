import {Types} from "mongoose";

export type Chu3GameMapType = {
    _id:Types.ObjectId;

    id: number;
    name: string;
    series: string;
    seriesId: number;
    category: string;
    rewards: {
        mapAreaId: number;
        rewardId: number;
        rewardName: string;
    }[]
}