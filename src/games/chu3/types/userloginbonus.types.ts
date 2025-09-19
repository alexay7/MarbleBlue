import {Types} from "mongoose";

export type Chu3UserLoginBonusType = {
    _id: Types.ObjectId;

    cardId: string;

    presetId: number;
    bonusCount: number;
    lastUpdateDate:Date;
    isWatched:boolean;
    isFinished:boolean;
    hasReceivedToday:boolean;
}