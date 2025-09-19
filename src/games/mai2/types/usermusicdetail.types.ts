import {Types} from "mongoose";

export type Mai2UserMusicDetailType = {
    _id: Types.ObjectId;

    userId: string;

    musicId: number;
    level: number;
    playCount: number;
    achievement: number;
    comboStatus: number;
    syncStatus: number;
    deluxscoreMax: number;
    scoreRank: number;
    extNum1: number;
}