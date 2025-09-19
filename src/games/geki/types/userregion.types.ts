import {Types} from "mongoose";

export type GekiUserRegionType = {
    _id:Types.ObjectId;

    userId: string;

    regionId: number;
    playCount: number;
}