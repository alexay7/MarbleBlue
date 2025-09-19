import {Types} from "mongoose";

export type GekiUserTradeItemType = {
    _id: Types.ObjectId;

    userId: string;

    chapterId: number;
    tradeItemId: number;
    tradeCount: number;
}