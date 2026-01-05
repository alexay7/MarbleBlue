import {Types} from "mongoose";

export type SdvxPcbType = {
    _id: Types.ObjectId;

    pcbId: string;
    userId?: Types.ObjectId;

    enabledFlags: string[];
    arenaSeason: number;

    unlockMusic: boolean;
}