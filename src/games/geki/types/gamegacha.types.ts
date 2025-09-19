import {Types} from "mongoose";

export type GekiGameGachaType = {
    _id:Types.ObjectId;

    gachaId: number;
    gachaName: string;
    type: number;
    kind: number;
    isCeiling: boolean;
    maxSelectPoint: number;
}

export type GekiGameGachaCardType = {
    _id:Types.ObjectId;

    gachaId: number;
    cardId: bigint;
    rarity: number;
    weight: number;
    isPickup: boolean;
    isSelect: boolean;
}