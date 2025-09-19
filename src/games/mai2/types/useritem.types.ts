import {Types} from "mongoose";

export type Mai2UserItemType = {
    _id: Types.ObjectId;

    userId: string;

    itemKind: number;
    itemId: number;
    stock: number;
    isValid: boolean;
}