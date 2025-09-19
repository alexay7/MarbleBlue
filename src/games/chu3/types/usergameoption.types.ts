import {Types} from "mongoose";

export type Chu3UserGameOptionType = {
    _id: Types.ObjectId;

    cardId: string;

    bgInfo: number;
    fieldColor: number;
    guideSound: number;
    soundEffect: number;
    guideLine: number;
    speed: number;
    optionSet: number;
    matching: number;
    judgePos: number;
    rating: number;
    judgeCritical: number;
    judgeJustice: number;
    judgeAttack: number;
    headphone: number;
    playerLevel: number;
    successTap: number;
    successExTap: number;
    successSlideHold: number;
    successAir: number;
    successFlick: number;
    successSkill: number;
    successTapTimbre: number;
    privacy: number;
    mirrorFumen: number;
    selectMusicFilterLv: number;
    sortMusicFilterLv: number;
    sortMusicGenre: number;
    categoryDetail: number;
    judgeTimingOffset: number;
    playTimingOffset: number;
    fieldWallPosition: number;
    resultVoiceShort: number;
    notesThickness: number;
    judgeAppendSe: number;
    trackSkip: number;
    hardJudge: number;
    speed_120: number;
    fieldWallPosition_120: number;
    playTimingOffset_120: number;
    judgeTimingOffset_120: number;
    ext1: number;
    ext2: number;
    ext3: number;
    ext4: number;
    ext5: number;
    ext6: number;
    ext7: number;
    ext8: number;
    ext9: number;
    ext10: number;
}