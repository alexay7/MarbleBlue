import {Types} from "mongoose";

export type Chu3GameMapConditionType = {
    type:number,
    conditionId:number,
    logicalOpe:number,
    startDate: Date | null,
    endDate: Date | null
}

export type Chu3GameMapConditionsType = {
    _id:Types.ObjectId,

    mapAreaId:bigint,
    length:number,
    mapAreaConditionlist:Chu3GameMapConditionType[]
}