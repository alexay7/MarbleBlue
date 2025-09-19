import {Types} from "mongoose";

export type Mai2UserFavoriteType = {
    _id: Types.ObjectId;

    userId: string;

    itemKind: number;
    itemidList: number[];
}