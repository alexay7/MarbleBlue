import {Types} from "mongoose";

export type Mai2GameLoginBonusType = {
    _id: Types.ObjectId;

    id: number;
    name: string;
    type: string;
    rewardId: number;
    rewardName: string;
}
