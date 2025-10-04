import {Types} from "mongoose";

export type GekiGameTrophyType = {
    _id: Types.ObjectId;

    trophyId: number;
    trophyName: string;
    description: string;
    rarity: string;
}