import {Types} from "mongoose";

export type Chu3UserCourseType = {
    _id:Types.ObjectId;

    cardId:string;

    classId:number;
    courseId:number;
    eventId:number;
    isAllJustice:boolean;
    isClear:boolean;
    isFullCombo:boolean;
    isSuccess:boolean;
    lastPlayDate:Date;
    param1:number;
    param2:number;
    param3:number;
    param4:number;
    playCount:number;
    theoryCount:number;
    scoreMax:number;
    scoreRank:number;
    orderId:number;
    playerRating:number;
}