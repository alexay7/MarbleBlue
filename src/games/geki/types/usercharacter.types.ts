import {Types} from "mongoose";

export type GekiUserCharacterType = {
    _id: Types.ObjectId;

    userId: string;

    characterId:number;
    costumeId:number;
    attachmentId:number;
    playCount:number;
    intimateLevel:number;
    intimateCount:number;
    intimateCountRewarded:number;
    intimateCountDate:Date;
    isNew:boolean;
}