import {Types} from "mongoose";

export type Mai2GameShopItemType = {
    _id: Types.ObjectId;

    itemId: number;
    itemType: string;
    price: number;
    imagePath: string;
    itemName: string;
    quantity: number;
}