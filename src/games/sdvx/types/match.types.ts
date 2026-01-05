import {Types} from "mongoose";
import type {SingleXmlVariableType} from "./common.types.ts";

export type SdvxMatchType = {
    _id:Types.ObjectId;

    createdAt: number;
    cVer:string;
    pNum:string;
    pRest:string;
    filter:string;
    mid:string;
    sec:string;
    port:string;
    gip:string;
    lip:string;
    claim:string;
    entryId:string;
}

export type MatchMakingRequestType = {
    game:{
        $:{
            k:string;
            method:"sv6_entry_s";
            ver:string;
        },
        c_ver:SingleXmlVariableType;
        p_num:SingleXmlVariableType;
        p_rest:SingleXmlVariableType;
        filter:SingleXmlVariableType;
        mid:SingleXmlVariableType;
        sec:SingleXmlVariableType;
        port:SingleXmlVariableType;
        gip:SingleXmlVariableType;
        lip:SingleXmlVariableType;
        claim:SingleXmlVariableType;
        entry_id:SingleXmlVariableType;
    }
}

export type LoungeRequestType = {
    game:{
        $:{
            k:string;
            method:"sv6_lounge_s";
            ver:string;
        },
        filter:SingleXmlVariableType;
    }
}