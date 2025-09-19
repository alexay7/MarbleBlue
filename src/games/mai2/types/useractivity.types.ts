import {Types} from "mongoose";

export type Mai2UserActType = {
    kind: number;
    id: number;
    sortNumber:bigint;
    param1: number;
    param2: number;
    param3: number;
    param4: number;
}

export type Mai2UserActivityType = {
    _id: Types.ObjectId;

    userId: string;

    playList: Mai2UserActType[];
    musicList: Mai2UserActType[];
}