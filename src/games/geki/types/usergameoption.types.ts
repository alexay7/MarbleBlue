import {Types} from "mongoose";

export type GekiUserGameOptionType = {
    _id:Types.ObjectId;

    userId:string;

    optionSet:number;
    speed:number;
    mirror:number;
    judgeTiming:number;
    judgeAdjustment:number;
    abort:number;
    stealthField:number;
    tapSound:number;
    volGuide:number;
    volAll:number;
    volTap:number;
    volCrTap:number;
    volHold:number;
    volSide:number;
    volFlick:number;
    volBell:number;
    volEnemy:number;
    volSkill:number;
    volDamage:number;
    colorField:number;
    colorLaneBright:number;
    colorWallBright:number;
    colorLane:number;
    colorSide:number;
    effectDamage:number;
    effectPos:number;
    effectAttack:number;
    judgeDisp:number;
    judgePos:number;
    judgeBreak:number;
    judgeHit:number;
    platinumBreakDisp:number;
    judgeCriticalBreak:number;
    matching:number;
    dispPlayerLv:number;
    dispRating:number;
    dispBP:number;
    headphone:number;
}