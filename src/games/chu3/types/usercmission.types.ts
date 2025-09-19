import {Types} from "mongoose";

export type Chu3UserCmissionType = {
    _id: Types.ObjectId;

    cardId: string;

    missionId: number;
    point: number;
}

export type Chu3UserCmissionProgressType = {
    _id: Types.ObjectId;

    cardId: string;

    missionId: number;
    order: number;
    stage: number;
    progress: number;
}

export type Chu3UserCmissionGameType = Chu3UserCmissionType &{
    userCMissionProgressList:Chu3UserCmissionProgressType[]
}