import {Types} from "mongoose";

export type GekiGameMusicType = {
    _id: Types.ObjectId;

    musicId: number,
    musicName: string,
    artistName: string,
    artistId: number,
    series: string,
    seriesId: number,
    genre: string,
    genreId: number,
    levels: [
        {
            level: number,
            difficulty: number
        },
        {
            level: number,
            difficulty: number
        },
        {
            level: number,
            difficulty: number
        },
        {
            level: number,
            difficulty: number
        },
        {
            level: number,
            difficulty: number
        }
    ],
    boss: {
        cardId: number,
        cardName: string
        level: number,
        attr: string
    },
    releaseDate: Date
}