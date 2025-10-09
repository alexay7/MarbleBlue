import {Types} from "mongoose";

export type Chu3GameTrophyType = {
    _id:Types.ObjectId,

    id: number,
    name: string,
    explanation: string,
    rarity: number,
    unlockable: boolean
}