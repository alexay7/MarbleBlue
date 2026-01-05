import {Types} from "mongoose";
import type {SingleXmlVariableType} from "./common.types.ts";

export type SdvxGameValgenType = {
    _id: Types.ObjectId;

    id: number;
    name:string;

    crew:number[];
    stamp:number[];
    subbg:number[];
    bgm:number[];
    nemsys:number[];
    sysbg:number[];
}

export type ValgenResult = {
    game:{
        refid:SingleXmlVariableType;
        valgene_id:SingleXmlVariableType;
        play_id:SingleXmlVariableType;
        consume_type:SingleXmlVariableType;
        price:SingleXmlVariableType;
        use_ticket:SingleXmlVariableType;
        item:{
            info:{
                id:SingleXmlVariableType;
                type:SingleXmlVariableType;
                param:SingleXmlVariableType;
            }[]
        }
        locid:SingleXmlVariableType;
    }
}