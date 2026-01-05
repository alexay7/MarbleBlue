import {Types} from "mongoose";

export type SdvxUserWeeklyMusicType = {
    _id: Types.ObjectId;

    cardId: string;
    version: number;

    weekId: string;
    musicId: string;
    musicType: string;
    exscore: string;
    rank: string;
}