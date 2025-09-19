import {Types} from "mongoose";

export type GekiUserRatingLogType = {
    _id: Types.ObjectId;

    userId: string;

    highestRating: number;
    newHighestRating: number;
    dataVersion: string;
}