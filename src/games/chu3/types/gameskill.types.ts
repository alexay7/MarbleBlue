import {Types} from "mongoose";

export type Chu3GameSkillType = {
    _id:Types.ObjectId;

    id: number;
    name: string;
    category: number;
};