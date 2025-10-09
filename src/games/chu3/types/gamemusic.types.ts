import {Types} from "mongoose";

export type Chu3GameMusicType = {
    _id: Types.ObjectId;

    id: number;
    name: string;
    sortName: string;
    artistId: number;
    artist: string;
    series: string;
    seriesId: number;
    genre: string;
    genreId: number;
    levels: {
        level: number;
        difficulty: number;
    }[];
    worldsEndDiff: number;
    worldsEndType: string
}