import {Types} from "mongoose";

export type SdvxUserCourseType = {
    _id: Types.ObjectId;

    cardId: string;
    version: number;

    // sid
    ssnid: string;
    // cid
    crsid: string;
    // stype
    st: string;
    // score
    sc: string;
    // exscore
    ex: string;
    // clear
    ct: string;
    // grade
    gr: string;
    // ?
    jr: string;
    // ?
    cr: string;
    // ?
    nr: string;
    // ?
    er: string;
    // ?
    cm: string;
    // rate
    ar: string;
    // maybe track record?
    tr?:[]
    // playcount
    cnt: number;
}