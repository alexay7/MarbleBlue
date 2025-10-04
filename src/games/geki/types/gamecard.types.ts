import {Types} from "mongoose";

export type GekiGameCardType = {
    _id: Types.ObjectId;

    cardId: number;
    cardName: string;
    rarity: string;
    attribute: string;
    characterId: number;
    characterName: string;
    seriesId: number;
    seriesName: string;
    attackLevels: number[];
    skills:string[];
}