import {Types} from "mongoose";

export type SdvxGameWeeklyMusicType = {
    _id:Types.ObjectId;

    weekId: number;
    musicId: number;
}