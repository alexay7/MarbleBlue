import {Types} from "mongoose";

export type GekiUserDeckType = {
    _id: Types.ObjectId

    userId: string;

    deckId: number;

    cardId1: number;

    cardId2: number;

    cardId3: number;
}