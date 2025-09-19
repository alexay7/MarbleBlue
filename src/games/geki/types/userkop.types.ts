import {Types} from "mongoose";

export type GekiUserKopType = {
    _id:Types.ObjectId;

    userId:string;

    authKey:string;
    kopId:number;
    areaId:number;
    totalTechScore:number;
    totalPlatinumScore:number;
    techRecordDate:Date;
    isTotalTechNewRecord:boolean;
}