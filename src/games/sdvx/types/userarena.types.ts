import {Types} from "mongoose";

export type SdvxUserArenaType = {
    _id: Types.ObjectId;

    cardId: string;
    version: number;

    season:string;
    rankPoint:number;
    shopPoint:number;
    ultimateRate:number;
    ultimateRankNum:string;
    megamixRate:number;
    rankPlayCnt:number;
    ultimatePlayCnt:number;
}