import {Types} from "mongoose";
import type {GekiUserDataType} from "./userdata.types.ts";
import type {GekiUserCharacterType} from "./usercharacter.types.ts";
import type {GekiUserCardType} from "./usercard.types.ts";
import type {GekiGameGachaCardType} from "./gamegacha.types.ts";
import type {GekiUserItemType} from "./useritem.types.ts";
import type {GekiUserActivityType} from "./useractivity.types.ts";

export type GekiUserGachaType = {
    _id: Types.ObjectId;

    userId: string;

    gachaId: number;
    totalGachaCnt: number;
    ceilingGachaCnt: number;
    selectPoint: number;
    useSelectPoint: number;
    dailyGachaCnt: number;
    fiveGachaCnt: number;
    elevenGachaCnt: number;
    dailyGachaDate: Date | null;
}

export type GekiCMUpsertGachaReqType = {
    userData:GekiUserDataType[];
    userCharacterList:GekiUserCharacterType[];
    userCardList:GekiUserCardType[];
    gameGachaCardList:GekiGameGachaCardType[];
    userItemList:GekiUserItemType[];

    isNewCharacterList:string;
    isNewCardList:string;
    isNewItemList:string;
}

export type GekiCMUpsertUserAllReqType = {
    userData:GekiUserDataType[];
    userActivity:GekiUserActivityType[];
    userCharacterList:GekiUserCharacterType[];
    userCardList:GekiUserCardType[];
    userItemList:GekiUserItemType[];

    isNewCharacterList:string;
    isNewCardList:string;
    isNewItemList:string;
}

export type GekiCMUpsertSelectReqType = {
    userData:GekiUserDataType[];
    userCharacterList:GekiUserCharacterType[];
    userCardList:GekiUserCardType[];
}

export type GekiCMUpsertSelectLogType = {
    gachaId:number;
    useSelectPoint:number;
    convertType:number;
    convertItem:number;
}