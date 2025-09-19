import axios from "axios";
import {log} from "./general.ts";
import type {GekiUserMusicDetailType} from "../games/geki/types/usermusicdetail.types.ts";
import {config} from "../config/config.ts";

type UserPB = {
    chartID:string,
    userID:number,
    scoreData:{
        score: number,
    }
}

type UserPBs = {
	success:boolean,
	description:string,
	body:{
		pbs:UserPB[],
		charts:SongChart[]
	}
}

type GekiUserPB = {
    success:boolean,
	description:string,
	body:{
		pbs: {
			chartID: string
			userID: number,
			scoreData: {
				score: number,
				noteLamp: "CLEAR" | "FULL COMBO" | "ALL BREAK",
				bellLamp: "FULL BELL" | "NONE",
				platinumScore: number,
				platinumStars: number,
				grade: "SSS+" | "SSS" | "SS" | "S" | "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "C" | "D",
				optional: {
					maxCombo?: number
				}
			}
		}[],
		charts:SongChart[]
	}
}

type SongChart = {
    chartID:string,
    data:{
        inGameID:number
    },
    difficulty: "BASIC" | "ADVANCED" | "EXPERT" | "MASTER" | "ULTIMA",
}

type Chu3UserPBsRes = {
    musicId:number,
    length:number,
    userRivalMusicDetailList:{
        level:number,
        scoreMax:number,
    }[]
}

type GekiUserPBsRes = {
    length:number,
    userRivalMusicDetailList:Omit<GekiUserMusicDetailType, "_id"|"userId"|"playCount"|"isLock"|"clearStatus"|"isStoryWatched">[]
}

function convertDifficulty(difficulty:"BASIC" | "ADVANCED" | "EXPERT" | "MASTER" | "ULTIMA"|"LUNATIC"):number{
	switch(difficulty){
	case "BASIC": return 0;
	case "ADVANCED": return 1;
	case "EXPERT": return 2;
	case "MASTER": return 3;
	case "ULTIMA": return 4;
	case "LUNATIC": return 4;
	}
}

function convertGrade(grade:"SSS+"|"SSS"|"SS"|"S"|"AAA"|"AA"|"A"|"BBB"|"BB"|"B"|"C"|"D"):number{
	switch(grade) {
	case "SSS+":
		return 12;
	case "SSS":
		return 11;
	case "SS":
		return 10;
	case "S":
		return 9;
	case "AAA":
		return 8;
	case "AA":
		return 7;
	case "A":
		return 6;
	case "BBB":
		return 5;
	case "BB":
		return 4;
	case "B":
		return 3;
	case "C":
		return 2;
	case "D":
		return 1;
	}
}

export async function getGekiPBs(userAlias:string):Promise<GekiUserPBsRes[]>{
	try {
		const rivalScores = await axios.get<GekiUserPB>(`${config.SCORES_SERVER}/api/v1/users/${userAlias}/games/ongeki/Single/pbs/all`);

		const rivalScoresData = rivalScores.data as GekiUserPB;

		if (!rivalScoresData.success) return [];

		const pbs = rivalScoresData.body.pbs;
		const charts = rivalScoresData.body.charts;

		const result: GekiUserPBsRes[] = [];

		for (const pb of pbs) {
			const chart = charts.find(c => c.chartID === pb.chartID);
			if (!chart) continue;

			const musicDetail: GekiUserPBsRes["userRivalMusicDetailList"][number]={
				musicId: chart.data.inGameID,
				level: convertDifficulty(chart.difficulty),
				battleScoreMax: 1234567,
				battleScoreRank: 3,
				isAllBreake: pb.scoreData.noteLamp === "ALL BREAK",
				isFullBell: pb.scoreData.bellLamp === "FULL BELL",
				isFullCombo: pb.scoreData.noteLamp === "FULL COMBO",
				maxComboCount: pb.scoreData.optional.maxCombo || 0,
				maxOverKill: 0,
				maxTeamOverKill: 0,
				platinumScoreMax: pb.scoreData.platinumScore,
				platinumScoreStar: pb.scoreData.platinumStars,
				techScoreMax: pb.scoreData.score,
				techScoreRank: convertGrade(pb.scoreData.grade),
			};

			let musicEntry = result.find(r => r.userRivalMusicDetailList.some(d => d.musicId === musicDetail.musicId) && r.length === 0);
			if (!musicEntry) {
				musicEntry = {
					length: 0,
					userRivalMusicDetailList: []
				};
				result.push(musicEntry);
			}
			musicEntry.userRivalMusicDetailList.push(musicDetail);
			musicEntry.length++;
		}

		return result;
	}catch{
		log("error", "kt", `Error al obtener los pbs de ${userAlias}`);
		return [];
	}
}

export async function getChuniPBs(userAlias:string):Promise<Chu3UserPBsRes[]>{
	try {
		const rivalScores = await axios.get<UserPBs>(`${config.SCORES_SERVER}/api/v1/users/${userAlias}/games/chunithm/Single/pbs/all`);

		const rivalScoresData = rivalScores.data as UserPBs;
		if (!rivalScoresData.success) return [];

		const pbs = rivalScoresData.body.pbs;
		const charts = rivalScoresData.body.charts;

		const result: Chu3UserPBsRes[] = [];

		for (const pb of pbs) {
			const chart = charts.find(c => c.chartID === pb.chartID);
			if (!chart) continue;

			const musicId = chart.data.inGameID;
			const difficulty = convertDifficulty(chart.difficulty);
			const score = pb.scoreData.score;

			let musicEntry = result.find(r => r.musicId === musicId && r.length === 0);
			if (!musicEntry) {
				musicEntry = {
					musicId: musicId,
					length: 0,
					userRivalMusicDetailList: []
				};
				result.push(musicEntry);
			}

			musicEntry.userRivalMusicDetailList.push({
				level: difficulty,
				scoreMax: score
			});
			musicEntry.length++;
		}

		return result;
	}catch{
		log("error", "kt", `Error al obtener los pbs de ${userAlias}`);
		return [];
	}
}