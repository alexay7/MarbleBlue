import {Types} from "mongoose";

export type Mai2UserCharacterType = {
    _id: Types.ObjectId;

    userId: string;

    characterId: number;
    point: number;
    count: number;
    level: number;
    nextAwake: number;
    nextAwakePercent: number;
    favorite: boolean;
    awakening: number;
    useCount: number;
}