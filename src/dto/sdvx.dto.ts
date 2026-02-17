import z from "zod";

export const importSvdxMusicDto = z.object({
	songId: z.number().min(0),
	songType: z.number().min(0).max(5),
	score: z.number().min(0),
	exscore: z.number().min(0),
	clearType: z.number().min(0).max(6),
	scoreGrade: z.number().min(1).max(10)
});

export const customizeDto = z.object({
	version: z.number(),
	userData: z.object({
		unlockCrew:z.boolean(),
		unlockAppeal:z.boolean(),
		additionalInfo:z.object({
			proTeamId:z.string()
		}),
		supportTeamId:z.string(),
		skillLevel:z.string().optional(),
		skillBaseId:z.string().optional(),
		skillNameId:z.string().optional(),
		skillType:z.string().optional()
	}),
	akanameParam: z.object({
		id: z.string().optional(),
		type: z.string().optional(),
		param: z.string().optional(),
	}),
	customParam: z.object({
		id: z.string().optional(),
		type: z.string().optional(),
		param: z.string().optional()
	})
});