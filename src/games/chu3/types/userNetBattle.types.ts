import {Types} from "mongoose";

export type Chu3UserNetBattleLogType = {
    _id: Types.ObjectId;

    cardId: string;

    musicId: number,
    difficultyId: number,
    score: number,

    roomId: number,
    track: number,
    selectUserId: string,
    selectUserName: string,
    opponentUserId1: string,
    opponentUserId2: string,
    opponentUserId3: string,
    opponentUserName1: string,
    opponentUserName2: string,
    opponentUserName3: string,
    opponentRegionId1: number,
    opponentRegionId2: number,
    opponentRegionId3: number,
    opponentRating1: number,
    opponentRating2: number,
    opponentRating3: number,
    opponentBattleRankId1: number,
    opponentBattleRankId2: number,
    opponentBattleRankId3: number,
    opponentClassEmblemMedal1: number,
    opponentClassEmblemMedal2: number,
    opponentClassEmblemMedal3: number,
    opponentClassEmblemBase1: number,
    opponentClassEmblemBase2: number,
    opponentClassEmblemBase3: number,
    opponentScore1: number,
    opponentScore2: number,
    opponentScore3: number,
    opponentCharaIllustId1: number,
    opponentCharaIllustId2: number,
    opponentCharaIllustId3: number,
    opponentCharaLv1: number,
    opponentCharaLv2: number,
    opponentCharaLv3: number,
    opponentRatingEffectColorId1: number,
    opponentRatingEffectColorId2: number,
    opponentRatingEffectColorId3: number,
    battleRuleId: number
}

export type Chu3UserNetBattleDataType = {
    _id: Types.ObjectId;

    cardId: string;

    recentNBSelectMusicList: { musicId: number }[],
    isRankUpChallengeFailed: boolean,
    highestBattleRankId: number,
    battleIconId: number,
    battleIconNum: number,
    avatarEffectPoint: number
}