import {Types} from "mongoose";

export type GekiGameLoginBonusItemType = {
    rewardId: number;
    itemName: string;
    itemId: number;
    quantity: number;
    rarity: string;
    type: string;
}

export type GekiGameLoginBonusType = {
    _id:Types.ObjectId;
    bonusId: number;
    bonusName: string;
    items: GekiGameLoginBonusItemType[];
    enabled: boolean;
}