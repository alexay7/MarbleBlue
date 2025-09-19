import {Types} from "mongoose";

export type Chu3TeamType = {
    teamId: number;
    teamName: string;
    ownerId:Types.ObjectId;
    lastMonthPoints: number;
}

export type Chu3UserTeamType = {
    _id:Types.ObjectId;

    cardId:string;

    teamId: number;

    currentPoints: number;
    currentPeriod: string;
}

export type Chu3TeamGameType = {
    "userId": number;
    "teamId": number
    "orderId": number
    "teamPoint": number
    "aggrDate": Date
}