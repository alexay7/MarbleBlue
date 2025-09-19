import {Types} from "mongoose";

export type Chu3GameGachaType = {
    _id: Types.ObjectId;

    gachaId: number;
    gachaName: string;
    type: number;
    kind: number;
    isCeiling: boolean;
    ceilingCnt: number;
    changeRateCnt: number;
    changeRateCnt2: number;
    startDate: Date;
    endDate: Date;
    noticeStartDate: Date;
    noticeEndDate: Date;
    cards: Chu3GameGachaCardType[];
}

export type Chu3GameGachaCardType = {
    _id: Types.ObjectId;

    gachaId: number;
    cardId: bigint;
    rarity: number;
    weight: number;
    isPickup: boolean;
    characterId: number;
}