import {Types} from "mongoose";

export type GekiUserMusicDetailType = {
    _id: Types.ObjectId;

    userId: string;

    musicId: number;
    level: number;
    playCount: number;
    techScoreMax: number;
    techScoreRank: number;
    battleScoreMax: number;
    battleScoreRank: number;
    platinumScoreMax: number;
    platinumScoreStar: number;
    maxComboCount: number;
    maxOverKill: number;
    maxTeamOverKill: number;
    isFullBell: boolean;
    isFullCombo: boolean;
    isAllBreake: boolean;
    isLock: boolean;
    clearStatus: number;
    isStoryWatched: boolean;
}