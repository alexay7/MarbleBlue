import wtf8 from "wtf-8";
import {Chu3UserMusicDetail} from "../games/chu3/models/usermusicdetail.model.ts";
import {Chu3GameMusic} from "../games/chu3/models/gamemusic.model.ts";

const XVerseTeamEmblems = {
	"GRAY":0,
	"RAINBOW":1,
	"GOLD":2,
	"SILVER":3,
	"PURPLE":4,
	"RED":5,
	"ORANGE":6,
	"GREEN":7
};

export function calculateTeamEmblem(rank:number, previousPoints:number){
	let emblemColor = XVerseTeamEmblems.GRAY;
	if (rank===-1) return emblemColor;

	if (rank <= 10) emblemColor = XVerseTeamEmblems.RAINBOW;
	else if (rank <= 40) emblemColor = XVerseTeamEmblems.GOLD;
	else if (rank <= 70) emblemColor = XVerseTeamEmblems.SILVER;
	else if (previousPoints >= 500000) emblemColor = XVerseTeamEmblems.PURPLE;
	else if (previousPoints >= 300000) emblemColor = XVerseTeamEmblems.RED;
	else if (previousPoints >= 150000) emblemColor = XVerseTeamEmblems.ORANGE;
	else if (previousPoints >= 50000) emblemColor = XVerseTeamEmblems.GREEN;

	return emblemColor;
}

export function chu3ToUtf8(input: string): string {
	return wtf8.decode(input);
}

function calculateRating(songConstant: number, score: number) {
	let rating = songConstant;

	if (score >= 1009000) rating += 2.15;
	else if (score >= 1007500) rating += 2.00 + (score - 1007500) / 100 * 0.01;
	else if (score >= 1005000) rating += 1.50 + (score - 1005000) / 50 * 0.01;
	else if (score >= 1000000) rating += 1.00 + (score - 1000000) / 100 * 0.01;
	else if (score >= 990000) rating += 0.60 + (score - 990000) / 250 * 0.01;
	else if (score >= 975000) rating += (score - 975000) / 250 * 0.01;
	else if (score >= 950000) rating += -1.67 + (score - 950000) / 150 * 0.01;
	else if (score >= 925000) rating += -3.34 + (score - 925000) / 150 * 0.01;
	else if (score >= 900000) rating += -5.00 + (score - 900000) / 150 * 0.01;
	else if (score >= 800000) rating = (rating - 5.00) / 2;
	else rating = 0;

	return Math.trunc(rating * 1000) / 1000;
}

export async function calculatePlayerNaiveRating(cardId: string){
	const songData = await Chu3GameMusic.find({});
	const bestScores = await Chu3UserMusicDetail.find({cardId: cardId});

	const scoreMap: Record<string, number> = {};
	bestScores.forEach(scoreEntry => {
		const songInfo = songData.find(song => song.id === scoreEntry.musicId);
		if (!songInfo) return;
		const levelInfo = songInfo.levels.find(level => level.level === scoreEntry.level);
		if (!levelInfo) return;
		scoreMap[`${scoreEntry.musicId}_${scoreEntry.level}`] = calculateRating(levelInfo.difficulty, scoreEntry.scoreMax);
	});

	// Get rating from 50 best scores sum
	const topRatings = Object.values(scoreMap).sort((a, b) => b - a).slice(0, 50);
	const totalRating = topRatings.reduce((acc, rating) => acc + rating, 0);

	return Math.floor(totalRating/50*100);
}