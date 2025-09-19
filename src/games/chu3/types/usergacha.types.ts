import {Types} from "mongoose";

export type Chu3UserGachaType = {
    _id: Types.ObjectId;

    cardId: string;

    gachaId: number;
    totalGachaCnt: number;
    ceilingGachaCnt: number;
    dailyGachaCnt: number;
    fiveGachaCnt: number;
    elevenGachaCnt: number;
    dailyGachaDate: Date;
}