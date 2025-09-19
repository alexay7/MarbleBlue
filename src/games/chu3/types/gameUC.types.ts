import {Types} from "mongoose";

export type Chu3GameUCType = {
    _id:Types.ObjectId;

    unlockChallengeId: number;

    conditionList: {
        type:number;
        conditionId:number;
        logicalOpe:number;
        startDate: Date | null;
        endDate: Date | null;
    }[]

    courses: {
        courseId:number;
        startDate: Date | null;
        endDate: Date | null;
    }[]
}