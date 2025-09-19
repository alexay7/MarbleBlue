import {Types} from "mongoose";

export type Mai2UserKaleidxScopeType = {
    _id: Types.ObjectId;

    userId: string;

    gateId: number;
    isGateFound: boolean;
    isKeyFound: boolean;
    isClear: boolean;
    totalRestLife: number;
    totalAchievement: number;
    totalDeluxscore: number;
    bestAchievement: number;
    bestDeluxscore: number;
    bestAchievementDate: Date | null;
    bestDeluxscoreDate: Date | null;
    playCount: number;
    clearDate: Date | null;
    lastPlayDate: Date | null;
    isInfoWatched: boolean;
}