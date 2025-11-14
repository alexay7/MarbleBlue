import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserGameOptionType} from "../types/usergameoption.types.ts";

const gekiUserGameOptionSchema = new Schema<GekiUserGameOptionType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true, unique:true},

	optionSet: {type:Number, default:0},
	speed: {type: Number, default: 0},
	mirror: {type: Number, default: 0},
	judgeTiming: {type: Number, default: 0},
	judgeAdjustment: {type: Number, default: 0},
	abort: {type: Number, default: 0},
	stealthField: {type: Number, default: 0},
	tapSound: {type: Number, default: 0},
	volGuide: {type: Number, default: 50},
	volAll: {type: Number, default: 50},
	volTap: {type: Number, default: 50},
	volCrTap: {type: Number, default: 50},
	volHold: {type: Number, default: 50},
	volSide: {type: Number, default: 50},
	volFlick: {type: Number, default: 50},
	volBell: {type: Number, default: 50},
	volEnemy: {type: Number, default: 50},
	volSkill: {type: Number, default: 50},
	volDamage: {type: Number, default: 50},
	colorField: {type: Number, default: 0},
	colorLaneBright: {type: Number, default: 0},
	colorWallBright: {type: Number, default: 0},
	colorLane: {type: Number, default: 0},
	colorSide: {type: Number, default: 0},
	effectDamage: {type: Number, default: 0},
	effectPos: {type: Number, default: 0},
	effectAttack: {type: Number, default: 0},
	judgeDisp: {type: Number, default: 0},
	judgePos: {type: Number, default: 0},
	judgeBreak: {type: Number, default: 0},
	judgeHit: {type: Number, default: 0},
	platinumBreakDisp: {type: Number, default: 0},
	judgeCriticalBreak: {type: Number, default: 0},
	matching: {type: Number, default: 0},
	dispPlayerLv: {type: Number, default: 0},
	dispRating: {type: Number, default: 0},
	dispBP: {type: Number, default: 0},
	headphone: {type: Number, default: 0},
});

export const GekiUserGameOption = mongoose.model<GekiUserGameOptionType>("GekiUserGameOption", gekiUserGameOptionSchema);