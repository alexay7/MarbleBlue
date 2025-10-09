import {Types} from "mongoose";

export type Chu3GameCourseType = {
    _id:Types.ObjectId;

    id: number;
    name: string;
    difficulty: number;
    songs: {
        musicId: number;
        musicName: string;
        level: number;
    }[]
}