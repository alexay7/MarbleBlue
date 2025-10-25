import {Types} from "mongoose";

export type Chu3GameShopItemType = {
    _id:Types.ObjectId;

    // 1- Currency, 2- Item, 3- Character, 4- Costumes
    shopId: number;

    itemId: bigint;

    itemType: string;

    price: number;

    // Coins: Game points, Points: Points per credit
    currencyType: "coins" | "points"

    imagePath: string;

    itemName: string;
}