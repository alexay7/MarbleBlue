import {Types} from "mongoose";

export type SdvxGameMusicType = {
    _id: Types.ObjectId;

    id:number;
    level:string;
    levelTag:string;
    difficulty:number;
    limited:string;
    plus:boolean;

    title:string;
    titleSort:string;
    artist:string;
    artistSort:string;
    addedDate:string;
    genre:string;
    maxExscore:number;

    radar:{
        notes:number;
        peak:number;
        tsunami:number;
        tricky:number;
        handTrip:number;
        oneHand:number;
    }
}