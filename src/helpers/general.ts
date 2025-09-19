import chalk from "chalk";

export const log = (color:"error"|"allnet"|"default"|"aime"|"aimePath"|"billing"|"game"|"gamePath"|"mongo", ...args: unknown[]
) => {
	switch (color){
	case "error":
		console.log(chalk.red(args));
		break;
	case "allnet":
		console.log(chalk.blue("[AllNet] ->", args));
		break;
	case "default":
		console.log(chalk.white(args));
		break;
	case "gamePath":
		console.log(chalk.bgYellowBright.black.bold("", args));
		break;
	case "game":
		console.debug(chalk.yellow("", args));
		break;
	case "aime":
		console.log(chalk.magentaBright("[AimeDb] ->", args));
		break;
	case "aimePath":
		console.log(chalk.bgMagenta.black.bold("[AimeDb] ->", args));
		break;
	case "billing":
		console.log(chalk.cyan("[Billing] ->", args));
		break;
	case "mongo":
		console.log(chalk.green("[MongoDB] ->", args));
		break;
	default:
		console.log(args);
	}
	return;
};

export function fd(date:Date) {
	const pad = (n:number, width = 2) => String(n).padStart(width, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.0`;
}