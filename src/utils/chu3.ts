import wtf8 from "wtf-8";

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