import {Types} from "mongoose";

export type Chu3UserUCType = {
    _id: Types.ObjectId;

    cardId: string;

    unlockChallengeId: number;
    status: number
    clearCourseId: number;
    conditionType: number;
    score: number;
    life: number;
    clearDate: Date;
}