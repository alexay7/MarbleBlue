import {Types} from "mongoose";

export type GekiUserBossType = {
    _id: Types.ObjectId;

    userId: string;

    musicId: number;
    damage: number;
    isClear: boolean;
    eventId: bigint;
}