import {Types} from "mongoose";

export type Chu3UserCharacterType = {
    _id:Types.ObjectId;

    cardId:string;

    characterId: number;
    playCount: number;
    level: number;
    friendshipExp: number;
    isValid: boolean;
    isNewMark: boolean;
    exMaxLv: number;
    assignIllust: number;
    param1: number;
    param2: number;
}