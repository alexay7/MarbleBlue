import {Types} from "mongoose";

export type Chu3UserActivityType = {
    _id:Types.ObjectId;

    cardId: string;

    kind: number;
    id: number;
    sortNumber: number;
    param1: number;
    param2: number;
    param3: number;
    param4: number;
}