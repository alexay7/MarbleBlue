import {Mai2GameMusic} from "../games/mai2/models/gamemusic.model.ts";
import {Mai2UserMusicDetailModel} from "../games/mai2/models/usermusicdetail.model.ts";

export function getThisWeeksCategoryRotation(): number {
	const currentWeekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));

	const genreList = [0, 1, 2, 3, 4, 5];

	return genreList[currentWeekNumber % genreList.length]!;
}

function calculateRating(songConstant: number, score: number, ap:boolean) {
	let rating = songConstant;

	if (score >= 1005000) rating *= 22.4 * 1.005;
	else if (score >= 1000000) rating *= 21.6 * score/1000000;
	else if (score >= 995000) rating *= 21.1 * score/1000000;
	else if (score >= 990000) rating *= 20.8 * score/1000000;
	else if (score >= 980000) rating *= 20.3 * score/1000000;
	else if (score >= 970000) rating *= 20.0 * score/1000000;
	else if (score >= 940000) rating *= 16.8 * score/1000000;
	else if (score >= 900000) rating *= 15.2 * score/1000000;
	else if (score >= 800000) rating *= 13.6 * score/1000000;
	else if (score >= 750000) rating *= 12.0 * score/1000000;
	else if (score >= 700000) rating *= 11.2 * score/1000000;
	else if (score >= 600000) rating *= 9.6 * score/1000000;
	else if (score >= 500000) rating *= 8.0 * score/1000000;
	else if (score >= 400000) rating *= 6.4 * score/1000000;
	else if (score >= 300000) rating *= 4.8 * score/1000000;
	else if (score >= 200000) rating *= 3.2 * score/1000000;
	else if (score >= 100000) rating *= 1.6 * score/1000000;
	else rating = 0;

	return rating + (ap ? 1 : 0);
}

export async function calculatePlayerNaiveRating(userId: string){
	const songData = await Mai2GameMusic.find({});
	const bestScores = await Mai2UserMusicDetailModel.find({userId: userId});

	const scoreMap: Record<string, number> = {};
	bestScores.forEach(scoreEntry => {
		const songInfo = songData.find(song => song.id === scoreEntry.musicId);
		if (!songInfo) return;
		const levelInfo = songInfo.levels.find(level => level.level === scoreEntry.level);
		if (!levelInfo) return;
		scoreMap[`${scoreEntry.musicId}_${scoreEntry.level}`] = calculateRating(levelInfo.difficulty, scoreEntry.achievement, scoreEntry.comboStatus>=3);
	});

	// Get rating from 50 best scores sum
	const topRatings = Object.values(scoreMap).sort((a, b) => b - a).slice(0, 50);
	const totalRating = topRatings.reduce((acc, rating) => acc + rating, 0);

	return Math.floor(totalRating);
}