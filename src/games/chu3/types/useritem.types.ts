import {Types} from "mongoose";

export type Chu3UserItemType = {
    _id: Types.ObjectId;

    cardId: string;

    itemKind: number;
    itemId: number;
    stock: number;
    isValid: boolean;
}