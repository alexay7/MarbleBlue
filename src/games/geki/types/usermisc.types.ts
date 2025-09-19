import {Types} from "mongoose";

export type GekiUserRatingType = {
    musicId: number;
    difficultId: number;
    romVersionCode: number;
    score: number;
    platinumScoreMax?: number;
    platinumScoreStar?: number;
}

export type GekiUserRivalType = {
    rivalUserId: bigint;
    rivalUserName: string;
    ktAlias: string;
}

export type GekiUserMiscType = {
    _id:Types.ObjectId;

    userId: string;

    userRecentRatingList: GekiUserRatingType[];
    userBpBaseList: GekiUserRatingType[];
    userRatingBaseBestNewList: GekiUserRatingType[];
    userRatingBaseBestList: GekiUserRatingType[];
    userRatingBaseHotList: GekiUserRatingType[];
    userRatingBaseNextNewList: GekiUserRatingType[];
    userRatingBaseNextList: GekiUserRatingType[];
    userRatingBaseHotNextList: GekiUserRatingType[];
    userNewRatingBasePScoreList: GekiUserRatingType[];
    userNewRatingBaseBestList: GekiUserRatingType[];
    userNewRatingBaseBestNewList: GekiUserRatingType[];
    userNewRatingBaseNextPScoreList: GekiUserRatingType[];
    userNewRatingBaseNextBestList: GekiUserRatingType[];
    userNewRatingBaseNextBestNewList: GekiUserRatingType[];

    rivalList: GekiUserRivalType[];
}