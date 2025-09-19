import {Types} from "mongoose";

export type GekiUserItemType = {
    _id: Types.ObjectId;

    userId: string;

    itemKind: number;
    itemId: number;
    stock: number;
    isValid: boolean;
}

export type GekiUserMusicItemType = {
    _id: Types.ObjectId;

    userId: string;

    musicId: number;
    status: number;
}