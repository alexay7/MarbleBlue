import {Types} from "mongoose";

export type GekiUserActivityType = {
    _id:Types.ObjectId;

    userId: string;

    kind: number;
    id: number;
    sortNumber: number;
    param1: number;
    param2: number;
    param3: number;
    param4: number;
}