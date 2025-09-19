import {Types} from "mongoose";

export type Chu3UserMapAreaType = {
    _id: Types.ObjectId;

    cardId: string;

    mapAreaId: number;
    position: number;
    isClear: boolean;
    rate: number;
    statusCount: number;
    remainGridCount: number;
    isLocked: boolean;
}