import {Types} from "mongoose";

export type Mai2UserCourseType = {
    _id: Types.ObjectId;

    userId: string;

    courseId: number;
    isLastClear: boolean;
    totalRestlife: number;
    totalAchievement: number;
    totalDeluxscore: number;
    playCount: number;
    clearDate: Date|null;
    lastPlayDate: Date|null;
    bestAchievement: number;
    bestAchievementDate: Date|null;
    bestDeluxscore: number;
    bestDeluxscoreDate: Date|null;
}