import {Types} from "mongoose";

export type Chu3GameCMissionRewardType = {
    rewardId: number;
    rewardName: string;
    points: number;
}

export type Chu3GameCMissionType = {
    _id:Types.ObjectId;

    id: number;
    name: string;
    characterId: number;
    rewards: Chu3GameCMissionRewardType[];
}