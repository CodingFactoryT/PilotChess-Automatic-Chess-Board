import fetchArduino from "../services/ArduinoCommunicator.js";

export async function waitForPieceMovement() {
	const fromPosition = null;
	//while (!(fromPosition = await hasTileGridChanged()));
	while (true) {
		await hasTileGridChanged();
	}
	console.log(fromPosition);
}

let lastReadPositioning = null;
async function hasTileGridChanged() {
	try {
		const response = await fetchArduino("REQ:READ:");
		const boardPositioning = response.split(",")[1];
		console.log(boardPositioning);
		lastReadPositioning = boardPositioning;
	} catch (error) {
		console.log(error);
	}
}
