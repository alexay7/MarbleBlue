import {Types} from "mongoose";
import type {Mai2UserExtendType} from "./userextend.types.ts";
import type {Mai2UserOptionType} from "./useroption.types.ts";
import type {Mai2UserCharacterType} from "./usercharacter.types.ts";
import type {Mai2UserMapType} from "./usermap.types.ts";
import type {Mai2UserLoginBonusType} from "./userloginbonus.types.ts";
import type {Mai2UserRatingType} from "./userrating.types.ts";
import type {Mai2UserItemType} from "./useritem.types.ts";
import type {Mai2UserMusicDetailType} from "./usermusicdetail.types.ts";
import type {Mai2UserCourseType} from "./usercourse.types.ts";
import type {Mai2UserFriendSeasonRankingType} from "./userfriendseasonranking.types.ts";
import type {Mai2UserFavoriteType} from "./userfavorite.types.ts";
import type {Mai2UserActivityType} from "./useractivity.types.ts";
import type {Mai2UserIntimateType} from "./userintimate.types.ts";
import type {Mai2UserKaleidxScopeType} from "./userkaleidxscope.types.ts";
import type {Mai2UserMissionType} from "./usermission.types.ts";

export type Mai2UserDataType = {
    _id: Types.ObjectId;

    userId: string;
    version: number;

    accessCode: string;
    userName: string;
    isNetMember: number;
    point: number;
    totalPoint: number;
    iconId: number;
    plateId: number;
    titleId: number;
    partnerId: number;
    frameId: number;
    selectMapId: number;
    totalAwake: number;
    gradeRating: number;
    musicRating: number;
    playerRating: number;
    highestRating: number;
    gradeRank: number;
    classRank: number;
    courseRank: number;
    charaSlot: number[];
    charaLockSlot: number[];
    contentBit: number;
    playCount: number;
    currentPlayCount: number;
    renameCredit: number;
    mapStock: number;
    eventWatchedDate: Date|null;
    lastGameId: string;
    lastRomVersion: string;
    lastDataVersion: string;
    lastLoginDate: Date|null;
    lastPlayDate: Date|null;
    lastPlayCredit: number;
    lastPlayMode: number;
    lastPlaceId: number;
    lastPlaceName: string;
    lastAllNetId: number;
    lastRegionName: string;
    lastClientId: string;
    lastCountryCode: string;
    lastSelectEMoney: number;
    lastSelectTicket: number;
    lastSelectCourse: number;
    lastCountCourse: number;
    firstGameId: string;
    firstRomVersion: string;
    firstDataVersion: string;
    firstPlayDate: Date|null;
    compatibleCmVersion: string;
    dailyBonusDate: Date|null;
    dailyCourseBonusDate: Date|null;
    lastPairLoginDate: Date|null;
    lastTrialPlayDate: Date|null;
    playVsCount: number;
    playSyncCount: number;
    winCount: number;
    helpCount: number;
    comboCount: number;
    totalDeluxscore: number;
    totalBasicDeluxscore: number;
    totalAdvancedDeluxscore: number;
    totalExpertDeluxscore: number;
    totalMasterDeluxscore: number;
    totalReMasterDeluxscore: number;
    totalSync: number;
    totalBasicSync: number;
    totalAdvancedSync: number;
    totalExpertSync: number;
    totalMasterSync: number;
    totalReMasterSync: number;
    totalAchievement: number;
    totalBasicAchievement: number;
    totalAdvancedAchievement: number;
    totalExpertAchievement: number;
    totalMasterAchievement: number;
    totalReMasterAchievement: number;
    playerOldRating: number;
    playerNewRating: number;
    banState: number;
    friendRegistSkip: number;
    dateTime: bigint;
}

export type Mai2UpsertUserAllRequest = {
    userData:Mai2UserDataType[];
    userExtend:Mai2UserExtendType[];
    userOption:Mai2UserOptionType[];
    userCharacterList:Mai2UserCharacterType[];
    userGhost:never[];
    userMapList:Mai2UserMapType[];
    userLoginBonusList:Mai2UserLoginBonusType[];
    userRatingList:Mai2UserRatingType[];
    userItemList:Mai2UserItemType[];
    userMusicDetailList:Mai2UserMusicDetailType[];
    userCourseList:Mai2UserCourseType[];
    userFriendSeasonRankingList:Mai2UserFriendSeasonRankingType[];
    userChargeList:never[];
    userFavoriteList:Mai2UserFavoriteType[];
    userActivityList:Mai2UserActivityType[];
    userMissionDataList:Mai2UserMissionType[];
    userWeeklyData: {
        lastLoginWeek:string
        beforeLoginWeek:string
        friendBonusFlag:boolean
    }
    userGamePlaylogList:never[];
    user2pPlaylog:{
        userId1:bigint;
        userId2:bigint;
        userName1:string;
        userName2:string;
        regionId:number;
        placeId:number;
        user2pPlaylogDetailList:never[]
    },
    userIntimateList:Mai2UserIntimateType[];
    userShopItemStockList:never[];
    userGetPointList:never[];
    userTradeItemList:never[];
    userFavoritemusicList:never[];
    userKaleidxScopeList:Mai2UserKaleidxScopeType[];

    isNewCharacterList:string;
    isNewMapList:string;
    isNewLoginBonusList:string;
    isNewItemList:string;
    isNewMusicDetailList:string;
    isNewCourseList:string;
    isNewFavoriteList:string;
    isNewFriendSeasonRankingList:string;
    isNewUserIntimateList:string;
    isNewFavoritemusicList:string;
    isNewKaleidxScopeList:string;
}