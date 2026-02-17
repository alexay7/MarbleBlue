import {GekiGameMusic} from "../games/geki/models/gamemusic.model.ts";
import {GekiUserMusicDetail} from "../games/geki/models/usermusicdetail.model.ts";
import type {GekiUserPlaylogType} from "../games/geki/types/userplaylog.types.ts";
import {Types} from "mongoose";

function calculateTechRating(songConstant: number, score: number, fullBell: boolean, lamp: "FC" | "AB" | "ABP" | "CLEAR") {
	let rating = songConstant;

	if (score === 1010000) rating += 2;
	else if (score >= 1007500) rating += 1.75 + (score - 1007500) / 10 * 0.001;
	else if (score >= 1000000) rating += 1.25 + (score - 1000000) / 15 * 0.001;
	else if (score >= 990000) rating += 0.75 + (score - 990000) / 20 * 0.001;
	else if (score >= 970000) rating += (score - 970000) / (80 / 3) * 0.001;
	else if (score >= 900000) rating += -4 + (score - 900000) / 17.5 * 0.001;
	else if (score >= 800000) rating += -6 + (score - 800000) / 50 * 0.001;
	else rating = 0;

	if (score >= 1007500) rating += 0.3;
	else if (score >= 1000000) rating += 0.2;
	else if (score >= 990000) rating += 0.1;

	if (fullBell) rating += 0.05;

	if (lamp === "ABP") rating += 0.35;
	else if (lamp === "AB") rating += 0.3;
	else if (lamp === "FC") rating += 0.1;

	return Math.trunc(rating * 1000) / 1000;
}

export async function calculatePlayerNaiveRating(userId: string, newSongs:GekiUserPlaylogType[]){
	const songData = await GekiGameMusic.find({});
	const bestScores = await GekiUserMusicDetail.find({userId: userId}).lean();

	// Update bestScores with newSongs data
	newSongs.forEach(newSong => {
		bestScores.push({
			_id:new Types.ObjectId(),
			__v:0,
			userId: userId,
			musicId: newSong.musicId,
			level: newSong.level,
			techScoreMax: newSong.techScore,
			isFullCombo: newSong.isFullCombo,
			isAllBreake: newSong.isAllBreak,
			isFullBell: newSong.isFullBell,
			playCount:1,
			techScoreRank: newSong.techScoreRank,
			battleScoreRank: newSong.battleScoreRank,
			battleScoreMax: newSong.battleScore,
			platinumScoreMax: newSong.platinumScore,
			platinumScoreStar: newSong.platinumScoreStar,
			maxComboCount: newSong.maxCombo,
			maxOverKill: newSong.overDamage,
			maxTeamOverKill: newSong.overDamage,
			isLock: false,
			clearStatus:newSong.clearStatus,
			isStoryWatched:false
		});
	});

	const scoreMap: Record<string, number> = {};
	bestScores.forEach(scoreEntry => {
		const songInfo = songData.find(song => song.musicId === scoreEntry.musicId);
		if (!songInfo) return;
		const levelInfo = songInfo.levels.find(level => level.level === scoreEntry.level);
		if (!levelInfo) return;
		scoreMap[`${scoreEntry.musicId}_${scoreEntry.level}`] = calculateTechRating(levelInfo.difficulty, scoreEntry.techScoreMax, scoreEntry.isFullBell, scoreEntry.techScoreMax===1010000 ? "ABP" : scoreEntry.isAllBreake ? "AB" : scoreEntry.isFullCombo ? "FC" : "CLEAR");
	});

	// Get rating from 50 best scores sum
	const topRatings = Object.values(scoreMap).sort((a, b) => b - a).slice(0, 50);
	const totalRating = topRatings.reduce((acc, rating) => acc + rating, 0);

	return Math.floor(totalRating * 1.2/50*1000);
}