import type {Chu3UserGameOptionType} from "./usergameoption.types.ts";
import type {Chu3UserCharacterType} from "./usercharacter.types.ts";
import type {Chu3UserItemType} from "./useritem.types.ts";
import type {Chu3UserMusicDetailType} from "./usermusicdetail.types.ts";
import type {Chu3UserActivityType} from "./useractivity.types.ts";
import type {Chu3UserMusicFavoriteType, Chu3UserRatingType} from "./usermisc.types.ts";
import type {Chu3UserMapAreaType} from "./usermaparea.types.ts";
import type {Schema} from "mongoose";
import type {Chu3UserPlaylogType} from "./userplaylog.types.ts";
import type {Chu3TeamGameType} from "./team.types.ts";
import type {Chu3UserCmissionGameType} from "./usercmission.types.ts";
import type {Chu3UserCourseType} from "./usercourse.types.ts";
import type {Chu3UserUCType} from "./userUC.types.ts";
import type {Chu3UserNetBattleDataType, Chu3UserNetBattleLogType} from "./userNetBattle.types.ts";
import type {Chu3UserLoginBonusType} from "./userloginbonus.types.ts";
import type {Chu3UserLVType} from "./userLV.types.ts";

export type Chu3UserDataType = {
    _id: Schema.Types.ObjectId;

    // Código identificativo de la tarjeta
    cardId: string;

    //Versión del juego (para soportar perfiles en múltiples versiones)
    version: number;

    // Código de acceso de la tarjeta
    accessCode: string;

    // Nombre
    userName:string;

    // Nivel
    level: number;

    // Reincarnaciones (veces que ha llegado al nivel 100)
    reincarnationNum: number;

    // Experiencia en el nivel actual
    exp: number;

    // Monedas
    point: bigint;

    // Ppoints
    ppoint: number;

    // Monedas totales
    totalPoint: bigint;

    // Partidas jugadas
    playCount: number;

    // Partidas multijugador jugadas
    multiPlayCount: number;

    // Rating
    playerRating: number;

    // Rating B30
    highestRating: number;

    // Accesorios
    nameplateId: number;
    frameId: number;
    characterId: number;
    trophyId: number;
    trophyIdSub1: number;
    trophyIdSub2: number;

    // Si el usuario ha jugado el tutorial
    playedTutorialBit: number;
    firstTutorialCancelNum: number;
    masterTutorialCancelNum: number;

    // Número total de mapas disponibles
    totalMapNum: number;

    // Suma de PBs
    totalHiScore: bigint;
    totalBasicHighScore: bigint;
    totalAdvancedHighScore: bigint;
    totalExpertHighScore: bigint;
    totalMasterHighScore: bigint;
    totalUltimaHighScore: bigint;

    // Fecha del último evento visto
    eventWatchedDate: Date;

    // Número de amigos
    friendCount: number;

    // Datos de la primera partida
    firstGameId:string;
    firstRomVersion: string;
    firstDataVersion: string;
    firstPlayDate: Date;

    // Datos de la última partida
    lastGameId: string;
    lastRomVersion: string;
    lastDataVersion: string;
    lastPlayDate: Date;
    lastPlaceId:number;
    lastPlaceName: string;
    lastRegionId: number;
    lastRegionName: string;
    lastAllNetId: number;
    lastClientId:string;
    lastCountryCode: string;

    // Indeterminados
    userNameEx:string;
    compatibleCmVersion:string;
    medal:number;
    exMapLoopCount:number;
    ext1:number;
    ext2:number;
    ext3:number;
    ext4:number;
    ext5:number;
    ext6:number;
    ext7:number;
    ext8:number;
    ext9:number;
    ext10:number;
    extStr1:string;
    extStr2:string;
    extLong1:bigint;
    extLong2:bigint;

    // Pinguino
    mapIconId: number;
    voiceId: number;
    avatarWear:number;
    avatarHead:number;
    avatarFace:number;
    avatarSkin:number;
    avatarItem:number;
    avatarFront:number;
    avatarBack:number;

    // Emblema de clase
    classEmblemBase: number;

    // Medalla de clase
    classEmblemMedal: number;

    // Casillas pendientes
    stockedGridCount: number;

    // Partidas online
    netBattlePlayCount: number;
    netBattleWinCount: number;
    netBattleLoseCount: number;
    netBattleConsecutiveWinCount: number;
    avatarPoint: number;
    battleRankId: number;
    battleRankPoint: number;
    eliteRankPoint: number;
    netBattle1stCount: number;
    netBattle2ndCount: number;
    netBattle3rdCount: number;
    netBattle4thCount: number;
    netBattleCorrection: number;
    netBattleErrCnt:number;
    netBattleHostErrCnt: number
    battleRewardStatus: number;
    battleRewardIndex: number;
    battleRewardCount: number;
    isNetBattleHost: boolean;
    netBattleEndState: number;

    // Dibujo del personaje
    charaIllustId: number;

    // Última habilidad elegida
    skillId: number;

    // Último escenario elegido
    stageId: number;

    // Overpower
    overPowerPoint:number;
    overPowerRate: number;
    overPowerLowerRank: number;
}

export type Chu3UpsertUserAllRequest = {
    userId: string;
    segaIdAuthKey: string;
    upsertUserAll:{
        userData?:Chu3UserDataType[];
        userGameOption?: Chu3UserGameOptionType[];
        userCharacterList?: Chu3UserCharacterType[];
        userItemList?: Chu3UserItemType[];
        userMusicDetailList?: Chu3UserMusicDetailType[];
        userActivityList?: Chu3UserActivityType[];
        userRecentRatingList?: Chu3UserRatingType[];
        userPlaylogList?: Chu3UserPlaylogType[];
        userChargeList?: never[];
        userCourseList?: Chu3UserCourseType[];
        userDuelList?: never[];
        userTeamPoint?: Chu3TeamGameType[];
        userRatingBaseHotList?: Chu3UserRatingType[];
        userRatingBaseList?: Chu3UserRatingType[];
        userRatingBaseNextList?: Chu3UserRatingType[];
        userRatingBaseNewList?: Chu3UserRatingType[];
        userRatingBaseNewNextList?: Chu3UserRatingType[];
        userLoginBonusList?: Chu3UserLoginBonusType[];
        userMapAreaList?: Chu3UserMapAreaType[];
        userEmoneyList?: never[];
        userOverPowerList?: never[];
        userNetBattleData?: Chu3UserNetBattleDataType[];
        userNetBattlelogList?: Chu3UserNetBattleLogType[];
        userCMissionList?: Chu3UserCmissionGameType[];
        userFavoriteMusicList?: Chu3UserMusicFavoriteType[];
        userUnlockChallengeList?: Chu3UserUCType[];
        userLinkedVerseList?: Chu3UserLVType[];
        isNewCharacterList:string;
        isNewMusicDetailList:string;
        isNewItemList:string;
        isNewCourseList:string;
        isNewDuelList:string;
        isNewCMissionList:string;
        isNewMapAreaList:string;
        isNewUnlockChallengeList:string;
        isNewLinkedVerseList:string;
    } & Record<string, unknown[]>;
}