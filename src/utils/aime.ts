export function generateExternalId(accessCode:string){
	const now = new Date().getTime();

	return accessCode.slice(-10, -5) + now.toString().slice(-4);
}

console.log(generateExternalId("6R7T4PHJWKRSFE17"));