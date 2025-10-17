import z from "zod";

export const UpdateChu3UserOptionsDto = z.object({
	cardId: z.string().min(1),

	bgInfo: z.number().int().min(0).max(10).optional(),
	fieldColor: z.number().int().min(0).max(5).optional(),
	guideSound: z.number().int().min(0).max(10).optional(),
	soundEffect: z.number().int().min(0).max(11).optional(),
	guideLine: z.number().int().min(0).max(4).optional(),
	speed: z.number().int().min(0).max(61).optional(),
	matching: z.number().int().min(0).max(2).optional(),
	judgePos: z.number().int().min(0).max(3).optional(),
	rating: z.number().int().min(0).max(1).optional(),
	judgeCritical: z.number().int().min(0).max(3).optional(),
	judgeJustice: z.number().int().min(0).max(3).optional(),
	judgeAttack: z.number().int().min(0).max(3).optional(),
	playerLevel: z.number().int().min(0).max(1).optional(),
	successTap: z.number().int().min(0).max(10).optional(),
	successExTap: z.number().int().min(0).max(10).optional(),
	successSlideHold: z.number().int().min(0).max(10).optional(),
	successAir: z.number().int().min(0).max(10).optional(),
	successFlick: z.number().int().min(0).max(10).optional(),
	successSkill: z.number().int().min(0).max(10).optional(),
	successTapTimbre: z.number().int().min(0).max(9).optional(),
	mirrorFumen: z.number().int().min(0).max(1).optional(),
	categoryDetail: z.number().int().min(0).max(1).optional(),
	judgeTimingOffset: z.number().int().min(0).max(40).optional(),
	playTimingOffset: z.number().int().min(0).max(40).optional(),
	fieldWallPosition: z.number().int().min(0).max(16).optional(),
	judgeAppendSe: z.number().int().min(0).max(3).optional(),
	trackSkip: z.number().int().min(0).max(7).optional(),
	speed_120: z.number().int().min(0).max(61).optional(),
	fieldWallPosition_120: z.number().int().min(0).max(16).optional(),
	playTimingOffset_120: z.number().int().min(0).max(40).optional(),
	judgeTimingOffset_120: z.number().int().min(0).max(40).optional(),
});

export const UpdateChu3UserDataDto = z.strictObject({
	userName: z.string().min(1).regex(/^[Ａ-Ｚａ-ｚ０-９ぁ-んァ-ヶー一-龠々・．：；？！～／＋－×÷＝♂♀∀＃＆＊＠☆○◎◇□△▽♪†‡ΣαβγθφψωДεё]+$/).optional(),
	trophyId: z.number().min(0).optional(),
	trophyIdSub1: z.number().min(0).optional(),
	trophyIdSub2: z.number().min(0).optional(),
	voiceId: z.number().min(0).optional(),
	avatarWear: z.number().min(0).optional(),
	avatarHead: z.number().min(0).optional(),
	avatarFace: z.number().min(0).optional(),
	avatarSkin: z.number().min(0).optional(),
	avatarItem: z.number().min(0).optional(),
	avatarBack: z.number().min(0).optional(),
	avatarFront: z.number().min(0).optional(),
	characterId: z.number().min(0).optional(),
	stageId: z.number().min(0).optional(),
	mapIconId: z.number().min(0).optional(),
	nameplateId: z.number().min(0).optional(),
	version: z.number().min(0),
});

const UpdateChu3UserRivalDto = z.object({
	ktAlias: z.string().min(1),
	id: z.number().min(1),
});

export const UpdateChu3UserRivalsDto = z.object({
	rivals: z.array(UpdateChu3UserRivalDto).max(3)
});

const UpdateChu3UserChatSymbolDto = z.object({
	sceneId: z.number().min(1).max(5),
	symbolId: z.number().min(1),
	orderId: z.number().min(0).max(3),
});

export const UpdateChu3UserChatSymbolsDto = z.object({
	chatSymbols: z.array(UpdateChu3UserChatSymbolDto).min(20).max(20)
});

export const UpdateChu3TeamDto = z.object({
	teamName: z.string().min(1).max(16).optional(),
});

export const importChu3MusicDto = z.object({
	musicId: z.number().min(0),
	level: z.number().min(0).max(4),
	playCount: z.number().min(0),
	scoreMax: z.number().min(0).max(10100001),
	missCount: z.number().min(0),
	maxComboCount: z.number().min(0),
	isFullCombo: z.boolean(),
	isAllJustice: z.boolean(),
	isSuccess: z.number().min(0),
	fullChain: z.number().min(0),
	maxChain: z.number().min(0),
	scoreRank: z.number().min(1).max(13),
	isLock: z.boolean(),
	theoryCount: z.number().min(0),
	ext1: z.number().min(0),
})