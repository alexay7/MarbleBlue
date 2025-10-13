import {Types} from "mongoose";

export type Chu3UserLVType = {
    _id: Types.ObjectId;

    cardId: string;

    linkedVerseId: string;
    progress: string;
    statusOpen: string;
    statusUnlock: string;
    isFirstClear: boolean;
    numClear: number;
    clearCourseId: number;
    clearCourseLevel: number;
    clearScore: number;
    clearDate: Date;
    clearUserId1: string;
    clearUserId2: string;
    clearUserId3: string;
    clearUserName0: string;
    clearUserName1: string;
    clearUserName2: string;
    clearUserName3: string;
}