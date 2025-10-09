import {Types} from "mongoose";

export type Chu3GameCharacterType = {
    _id:Types.ObjectId;

    id: number;
    name: string;
    sortName: string;
    series: string;
    seriesId: number;
};