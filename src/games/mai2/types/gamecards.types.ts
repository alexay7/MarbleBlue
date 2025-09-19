import {Types} from "mongoose";

export type Mai2GameCardType = {
    _id:Types.ObjectId;

    cardId: string;
    cardName: string;
}