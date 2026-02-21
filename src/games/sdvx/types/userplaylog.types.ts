import type {SingleXmlVariableType} from "./common.types.ts";
import {Types} from "mongoose";

export type SdvxUserPlaylogType = {
    _id:Types.ObjectId;

    cardId:string;
    version:number;
    plus:boolean;

    trackId:string;
    songId:string;
    songType:string;
    score:string;
    exscore:string;
    clearType:string;
    scoreGrade:string;
    maxChain:string;
    just:string;
    critical:string;
    near:string;
    error:string;
    effectiveRate:string;
    btnRate:string;
    longRate:string;
    volRate:string;
    mode:string;
    startOption:string;
    gaugeType:string;
    notesOption:string;
    onlineNum:string;
    localNum:string;
    challengeType:string;
    retryCnt:string;
    judge:string;
    dropFrame:string;
    dropFrameMax:string;
    dropCount:string;
    etc:string;
    mixId:string;
    mixLike:string;

    matching:{
        code:string;
        score:string;
    }[]
}

export type UpsertUserPlaylogType = {
    game:{
        refid:SingleXmlVariableType;
        dataid:SingleXmlVariableType;
        locid:SingleXmlVariableType;
        track:{
            play_id:SingleXmlVariableType;
            track_no:SingleXmlVariableType;
            music_id:SingleXmlVariableType;
            music_type:SingleXmlVariableType;
            score:SingleXmlVariableType;
            exscore:SingleXmlVariableType;
            clear_type:SingleXmlVariableType
            score_grade:SingleXmlVariableType;
            max_chain:SingleXmlVariableType;
            just:SingleXmlVariableType;
            critical:SingleXmlVariableType
            near:SingleXmlVariableType;
            error:SingleXmlVariableType;
            effective_rate:SingleXmlVariableType;
            btn_rate:SingleXmlVariableType
            long_rate:SingleXmlVariableType;
            vol_rate:SingleXmlVariableType;
            mode:SingleXmlVariableType;
            start_option:SingleXmlVariableType;
            gauge_type:SingleXmlVariableType;
            notes_option:SingleXmlVariableType;
            online_num:SingleXmlVariableType;
            local_num:SingleXmlVariableType;
            challenge_type:SingleXmlVariableType
            retry_cnt:SingleXmlVariableType;
            judge:SingleXmlVariableType;
            drop_frame:SingleXmlVariableType;
            drop_frame_max:SingleXmlVariableType;
            drop_count:SingleXmlVariableType;
            etc:SingleXmlVariableType;
            mix_id:SingleXmlVariableType;
            mix_like:SingleXmlVariableType;
            matching:{
              code:SingleXmlVariableType;
              score:SingleXmlVariableType;
            }[]
        }[]
    }
}