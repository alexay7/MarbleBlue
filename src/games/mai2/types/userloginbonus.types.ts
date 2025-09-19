import {Types} from "mongoose";

export type Mai2UserLoginBonusType = {
    _id: Types.ObjectId;

    userId: string;

    bonusId: number;
    point: number;
    isCurrent: boolean;
    isComplete: boolean;
}