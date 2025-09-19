import {Types} from "mongoose";

export type GekiUserTechCountType = {
    _id: Types.ObjectId;

    userId: string;

    levelId: number;
    allBreakCount: number;
    allBreakPlusCount: number;
}