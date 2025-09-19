import {Types} from "mongoose";

export type Chu3UserMusicDetailType = {
    _id:Types.ObjectId;

    cardId:string;

    musicId: number;
    level: number;
    playCount: number;
    scoreMax: number;
    missCount: number;
    maxComboCount: number;
    isFullCombo: boolean;
    isAllJustice: boolean;
    isSuccess: number;
    fullChain: number;
    maxChain: number;
    scoreRank: number;
    isLock: boolean;
    theoryCount: number;
    ext1: number;
}