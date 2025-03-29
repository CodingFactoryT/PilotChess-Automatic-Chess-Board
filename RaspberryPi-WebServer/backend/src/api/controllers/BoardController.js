import fetchArduino from "../services/ArduinoCommunicator.js";

export async function waitForPieceMovement() {
	const fromPosition = null;
	//while (!(fromPosition = await hasTileGridChanged()));
	while (true) {
		console.log("Connected, starting fetching data");
		await hasTileGridChanged();
	}
	console.log(fromPosition);
}

let lastReadPositioning = null;
async function hasTileGridChanged() {
	try {
		const response = await fetchArduino("REQ:READ:");
		console.log(response);
		const boardPositioning = response.split(",")[1];
		lastReadPositioning = boardPositioning;
	} catch (error) {
		console.log(error);
	}
}
