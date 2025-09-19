import {Types} from "mongoose";

export type GekiUserMissionPointType = {
    _id:Types.ObjectId;

    userId: string;

    eventId: bigint;
    point:number;
}