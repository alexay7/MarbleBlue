import {Types} from "mongoose";

export type Chu3GameChatSymbolType = {
    _id:Types.ObjectId
    id: number;

    name: string;
    sortName: string;
    description: string;
    bubbleId: number;
    scenes: number[]
}