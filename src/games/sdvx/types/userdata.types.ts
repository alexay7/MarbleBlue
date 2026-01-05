import type {SingleXmlVariableType} from "./common.types.ts";
import {Types} from "mongoose";

export type SdvxUserDataType = {
    _id:Types.ObjectId;

    cardId:string;
    version:number;
    lastPlayed:Date;
    rivals:string[];
    unlocCustoms: boolean;
    unlockCrew: boolean;
    unlockAppeal: boolean;

    name: string;
    sdvxId:string;
    gamecoinPacket:number;
    gamecoinBlock:number;
    appealId:string;
    akaname:string;

    lastMusicId:string;
    lastMusicType:string;
    sortType:string;
    headphone:string;
    blasterEnergy:number;

    hispeed:string;
    lanespeed:string;
    gaugeOption:string;
    arsOption:string;
    notesOption:string;
    earlyLateDisp:string;
    drawAdjust:string;
    effCLeft:string;
    effCRight:string;
    narrowDown:string;

    kacId:string;

    skillLevel:string;
    skillBaseId:string;
    skillNameId:string;
    skllType:string;

    supportTeamId:string;

    additionalInfo:{
        proTeamId:string;
    }

    eaShop:{
        packetBooster:number;
        blockBooster:number;
        blasterPassEnable:string;
        blasterPassLimitDate:string;
    }

    eaappli:{
        relation:string;
    }
    cloud:{
        relation:string;
    }
    blockNo:string;

    playCount:number;
    dayCount:number;
    todayCount:number;
    playChain:number;
    maxPlayChain:number;
    weekCount:number;
    weekPlayCount:number;
    weekChain:number;
    maxWeekChain:number;

    valgeneTicket:{
        ticketNum:number;
        limitDate:string;
    }

    creatorItem:{
        info:{
          creatorType:string;
          itemId:string;
          param:string;
        }
    }
}

export type UpsertUserDataType = {
    game: {
        play_id: SingleXmlVariableType,
        refid: SingleXmlVariableType,
        locid: SingleXmlVariableType,
        appeal_id: SingleXmlVariableType,
        skill_level: SingleXmlVariableType,
        skill_base_id: SingleXmlVariableType,
        skill_name_id: SingleXmlVariableType,
        skill_type: SingleXmlVariableType,
        earned_gamecoin_packet: SingleXmlVariableType,
        earned_gamecoin_block: SingleXmlVariableType,
        earned_blaster_energy: SingleXmlVariableType,
        p_start: SingleXmlVariableType,
        p_end: SingleXmlVariableType,
        ea_shop: {
            used_packet_booster: SingleXmlVariableType,
            used_block_booster: SingleXmlVariableType
        },
        arena: {
            season: SingleXmlVariableType,
            earned_rank_point: SingleXmlVariableType,
            earned_shop_point: SingleXmlVariableType,
            earned_ultimate_rate: SingleXmlVariableType,
            earned_megamix_rate: SingleXmlVariableType,
            rank_play: SingleXmlVariableType,
            ultimate_play: SingleXmlVariableType
        },
        hispeed: SingleXmlVariableType,
        lanespeed: SingleXmlVariableType,
        gauge_option: SingleXmlVariableType
        ars_option: SingleXmlVariableType,
        notes_option: SingleXmlVariableType,
        early_late_disp: SingleXmlVariableType,
        draw_adjust: SingleXmlVariableType,
        eff_c_left: SingleXmlVariableType,
        eff_c_right: SingleXmlVariableType,
        music_id: SingleXmlVariableType,
        music_type: SingleXmlVariableType,
        sort_type: SingleXmlVariableType,
        narrow_down: SingleXmlVariableType,
        headphone: SingleXmlVariableType,
        item: {
            info: {
                id: SingleXmlVariableType,
                type: SingleXmlVariableType,
                param: SingleXmlVariableType
            }[]
        },
        param: {
            info: {
                type: SingleXmlVariableType,
                id: SingleXmlVariableType,
                param: {
                    $: {
                        "__type": string
                        "__count": string
                    },
                    _: string
                }
            }[]
        },
        course?: {
            ssnid: SingleXmlVariableType,
            crsid: SingleXmlVariableType,
            st:SingleXmlVariableType,
            sc:SingleXmlVariableType,
            ex:SingleXmlVariableType,
            ct:SingleXmlVariableType
            gr:SingleXmlVariableType
            jr:SingleXmlVariableType
            cr:SingleXmlVariableType
            nr:SingleXmlVariableType
            er:SingleXmlVariableType
            cm:SingleXmlVariableType
            ar:SingleXmlVariableType
            tr:{
                st:SingleXmlVariableType,
                sc:SingleXmlVariableType,
                ex:SingleXmlVariableType,
                ct:SingleXmlVariableType
                gr:SingleXmlVariableType
                jr:SingleXmlVariableType
                cr:SingleXmlVariableType
                nr:SingleXmlVariableType
                er:SingleXmlVariableType
                pr:SingleXmlVariableType
            }[]
        }
        variant_gate?: {
            earned_power: SingleXmlVariableType,
            earned_element: {
                notes: SingleXmlVariableType,
                peak: SingleXmlVariableType,
                tsumami: SingleXmlVariableType,
                tricky: SingleXmlVariableType,
                onehand: SingleXmlVariableType,
                handtrip: SingleXmlVariableType
            },
            over_radar?: {
                $: {
                    "__count": string,
                    "__type": string
                }
            }
        },
        print: {
            count: SingleXmlVariableType
        },
        start_option: SingleXmlVariableType
    }
}

export type CreateUserDataType = {
    game:{
        $:{
            k:string,
            method:"sv6_new",
            ver:string
        },
        dataid:SingleXmlVariableType,
        refid:SingleXmlVariableType,
        cardno:SingleXmlVariableType,
        name:SingleXmlVariableType,
        locid:SingleXmlVariableType
    }
}

export type SaveWeeklyMusicType = {
    game: {
        locid: SingleXmlVariableType,
        cardnumber: SingleXmlVariableType,
        refid: SingleXmlVariableType,
        playid: SingleXmlVariableType,
        is_paseli: SingleXmlVariableType,
        online_num: SingleXmlVariableType,
        local_num: SingleXmlVariableType,
        start_option: SingleXmlVariableType,
        print_num: SingleXmlVariableType,
        start_time: SingleXmlVariableType,
        valgene_num: SingleXmlVariableType,
        played_music: {
            music: {
                $: {
                    id: string,
                    type: string
                }
            }[]
        }
        weekly_music: {
            week_id: SingleXmlVariableType,
            music_id: SingleXmlVariableType,
            music_type: SingleXmlVariableType,
            exscore: SingleXmlVariableType,
            play_cnt: SingleXmlVariableType
            hiscore_ctn: SingleXmlVariableType
        }[]
    }
}

export type LoadUserDataType = {
    game:{
        $:{
            k:string,
            method:"sv6_load",
            ver:string
        },
        dataid:SingleXmlVariableType,
        cardid:SingleXmlVariableType,
        refid:SingleXmlVariableType,
        cardno:SingleXmlVariableType,
        locid:SingleXmlVariableType
    }
}

export type CardInquireType = {
    cardmng:{
        $:{
            cardid:string
            cardtype:string
            method:"inquire",
            update:string
        }
    }
}

export type CardGetRefIdType = {
    cardmng:{
        $:{
            method:"getrefid",
            cardid:string,
            passwd:string
        }
    }
}

export type CardAuthPassType = {
    cardmng:{
        $:{
            method:"authpass",
            pass:string,
            refid:string
        }
    }
}