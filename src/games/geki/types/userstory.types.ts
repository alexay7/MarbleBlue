import {Types} from "mongoose";

export type GekiUserStoryType = {
    _id: Types.ObjectId;

    userId: string;

    storyId: number;
    lastChapterId: number;
    jewelCount: number;
    lastPlayMusicId: number;
    lastPlayMusicCategory: number;
    lastPlayMusicLevel: number;
}