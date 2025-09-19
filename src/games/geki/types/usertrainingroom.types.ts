import {Types} from "mongoose";

export type GekiUserTrainingRoomType = {
    _id: Types.ObjectId;

    userId: string;

    authKey: string;
    roomId: number;
    cardId: number;
    valueDate:Date;
}