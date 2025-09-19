import {Types} from "mongoose";

export type GekiGameEventType = {
    _id: Types.ObjectId;

    eventId: bigint;
    eventName: string;
    eventType: string;
    active: boolean;

    chapterId?: bigint;
    chapterName?: string;
    songs?: number[];
}