import z from "zod";

export const UpdateGekiUserOptionsDto = z.object({
	speed: z.number().min(0).max(76),
	mirror: z.number().min(0).max(1),
	judgeTiming: z.number().min(0).max(40),
	judgeAdjustment: z.number().min(0).max(40),
	abort: z.number().min(0).max(3),
	stealthField: z.number().min(0).max(1),
	tapSound: z.number().min(0).max(7),
	volGuide: z.number().min(0).max(11),
	volAll: z.number().min(0).max(11),
	volTap: z.number().min(0).max(11),
	volCrTap: z.number().min(0).max(11),
	volHold: z.number().min(0).max(11),
	volSide: z.number().min(0).max(11),
	volFlick: z.number().min(0).max(11),
	volBell: z.number().min(0).max(11),
	volEnemy: z.number().min(0).max(11),
	volSkill: z.number().min(0).max(11),
	volDamage: z.number().min(0).max(11),
	colorField: z.number().min(0).max(6),
	colorLaneBright: z.number().min(0).max(7),
	colorWallBright: z.number().min(0).max(7),
	colorLane: z.number().min(0).max(6),
	colorSide: z.number().min(0).max(3),
	effectDamage: z.number().min(0).max(1),
	effectPos: z.number().min(0).max(1),
	effectAttack: z.number().min(0).max(1),
	judgeDisp: z.number().min(0).max(9),
	judgePos: z.number().min(0).max(4),
	judgeBreak: z.number().min(0).max(1),
	judgeHit: z.number().min(0).max(1),
	platinumBreakDisp: z.number().min(0).max(1),
	judgeCriticalBreak: z.number().min(0).max(1),
	matching: z.number().min(0).max(1),
	dispPlayerLv: z.number().min(0).max(1),
	dispRating: z.number().min(0).max(1),
	dispBP: z.number().min(0).max(1),
	headphone: z.number().min(0).max(10)
});

export const UpdateGekiUserDataDto = z.strictObject({
	userName: z.string().min(1).regex(/^[Ａ-Ｚａ-ｚ０-９ぁ-んァ-ヶー一-龠々・．：；？！～／＋－×÷＝♂♀∀＃＆＊＠☆○◎◇□△▽♪†‡ΣαβγθφψωДё]+$/).optional(),
	nameplateId: z.number().optional(),
	trophyId: z.number().optional(),
	characterId: z.number().optional(),
});

const UpdateGekiUserRivalDto = z.object({
	rivalUserName: z.string().min(1),
	rivalUserId: z.number().min(1),
});

export const UpdateGekiUserRivalsDto = z.object({
	rivals: z.array(UpdateGekiUserRivalDto).max(3)
});
