import {Types} from "mongoose";

export type GekiUserEventMapType = {
    _id: Types.ObjectId;

    userId: string;

    eventId: bigint;
    mapId: number;
    mapData:string;
    totalPoint: number;
    totalUsePoint: number;
}