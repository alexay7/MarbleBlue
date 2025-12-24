export function getThisWeeksCategoryRotation(): number {
	const currentWeekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));

	const genreList = [0, 1, 2, 3, 4, 5];

	return genreList[currentWeekNumber % genreList.length]!;
}