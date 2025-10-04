import {Types} from "mongoose";

export type GekiGameChapterType = {
    _id:Types.ObjectId;

    chapterId: number;
    chapterName: string;

    musics: {
        musicId: number;
        musicName: string;
    }[];

    shopItems: {
        itemId: number;
        itemName: string;
        itemType: string;
    }[];
}