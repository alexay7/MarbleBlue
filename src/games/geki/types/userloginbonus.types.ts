import {Types} from "mongoose";

export type GekiUserLoginBonusType = {
    _id: Types.ObjectId;

    userId: string;

    bonusId: number;
    bonusCount: number;
    lastUpdateDate: Date;
}