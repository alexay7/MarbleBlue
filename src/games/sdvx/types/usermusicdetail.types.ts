import {Types} from "mongoose";
import type {SingleXmlVariableType} from "./common.types.ts";

export type SdvxUserMusicDetailType = {
    _id:Types.ObjectId;

    cardId:string;
    sdvxId:string;
    name:string;
    version:number;

    songId:number;
    songType:number;
    score:number;
    exscore:number;
    clearType:number;
    scoreGrade:number;

    btnRate:number;
    longRate:number;
    volRate:number;
}

export type HiScoreRequestType = {
    game:{
        $:{
            k:string;
            method:"sv6_hiscore";
            ver:string;
        },
        locid:SingleXmlVariableType;
        limit:SingleXmlVariableType;
        offset:SingleXmlVariableType;
    }
}