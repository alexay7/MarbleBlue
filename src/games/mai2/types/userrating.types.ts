import {Types} from "mongoose";

export type Mai2UserRateType = {

    musicId: number;
    level: number;
    romVersion: number;
    achievement: number;
}

export type Mai2UserUdemaeType = {
    rate: number;
    maxRate: number;
    classValue: number;
    maxClassValue: number;
    totalWinNum: number;
    totalLoseNum: number;
    maxWinNum: number;
    maxLoseNum: number;
    winNum: number;
    loseNum: number;
    npcTotalWinNum: number;
    npcTotalLoseNum: number;
    npcMaxWinNum: number;
    npcMaxLoseNum: number;
    npcWinNum: number;
    npcLoseNum: number;
}

export type Mai2UserRatingType = {
    _id: Types.ObjectId;

    userId: string;

    rating: number;
    ratingList: Mai2UserRateType[];
    newRatingList: Mai2UserRateType[];
    nextRatingList: Mai2UserRateType[];
    nextNewRatingList: Mai2UserRateType[];
    udemae: Mai2UserUdemaeType;
}