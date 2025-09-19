import {Types} from "mongoose";

export type GekiUserChapterType = {
    _id: Types.ObjectId

    userId: string;

    chapterId: number;
    jewelCount: number;
    lastPlayMusicCategory: number;
    lastPlayMusicId: number;
    lastPlayMusicLevel: number;
    isStoryWatched: boolean;
    isClear: boolean;
    skipTiming1: number;
    skipTiming2: number;
}

export type GekiUserMemoryChapterType = {
    _id: Types.ObjectId

    userId: string;

    chapterId:number;
    jewelCount:number;
    lastPlayMusicCategory:number;
    lastPlayMusicId:number;
    lastPlayMusicLevel:number;
    isDialogWatched:boolean;
    isStoryWatched:boolean;
    isBossWatched:boolean;
    isEndingWatched:boolean;
    isClear:boolean;
    gaugeId:number;
    gaugeNum:number;
}