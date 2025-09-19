import {Types} from "mongoose";

export type Mai2UserMapType = {
    _id: Types.ObjectId;

    userId: string;

    mapId: number;
    distance: number;
    isLock: boolean;
    isClear: boolean;
    isComplete: boolean;
    unlockFlag: number;
}