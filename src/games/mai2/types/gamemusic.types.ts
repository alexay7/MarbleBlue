import {Types} from "mongoose";

export type Mai2GameMusicType = {
    _id: Types.ObjectId;

    id: number;
    name: string;
    sortName: string;
    artistId: number;
    artist: string;
    genre: string;
    genreId: number;
    levels: {
        level: number;
        difficulty: number;
    }[];
    utageType: string|null
}