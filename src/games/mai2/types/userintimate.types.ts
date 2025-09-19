import {Types} from "mongoose";

export type Mai2UserIntimateType = {
    _id: Types.ObjectId;

    userId: string;

    partnerId: number;
    intimateLevel: number;
    intimateCountRewarded: number;
}