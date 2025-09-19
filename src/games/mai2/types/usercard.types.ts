import {Types} from "mongoose";

export type Mai2UserCardType = {
    _id:Types.ObjectId;

    userId: string;

    cardId: bigint;
    cardTypeId: number;
    charaId: number;
    mapId: number;
    startDate: Date
    endDate: Date;
}