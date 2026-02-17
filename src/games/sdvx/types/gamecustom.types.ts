import {Types} from "mongoose";

export type SdvxGameCustomType = {
    _id: Types.ObjectId;

    id:number;
    name:string;
} & (
    | { variant:"sysbg"|"skill"|"appealframe"|"nemsys"|"bgm"|"stamp"}
    | {type:"normal"|"slideshow"|"video", variant:"subbg"}
    | {filename:string, variant:"stamp"}
    )