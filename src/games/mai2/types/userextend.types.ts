import {Types} from "mongoose";

export type Mai2UserExtendType = {
    _id: Types.ObjectId;

    userId: string;

    selectMusicId: number;
    selectDifficultyId: number;
    categoryIndex: number;
    musicIndex: number;
    extraFlag: number;
    selectScoreType: number;
    extendContentBit: bigint;
    isPhotoAgree: boolean;
    isGotoCodeRead: boolean;
    selectResultDetails: boolean;
    sortCategorySetting: number;
    sortMusicSetting: number;
    playStatusSetting: number;
    selectResultScoreViewType: number;
    selectedCardList: number[];
    encountMapNpcList: {
        npcId: number;
        musicId: number;
    }[]
};