import fetchArduino from "../services/ArduinoCommunicator.js";

export async function waitForPieceMovement() {
	let fromPosition = null;
	let toPosition = null;

	while (fromPosition === toPosition) {
		while (!(fromPosition = await hasTileGridChanged()));
		while (!(toPosition = await hasTileGridChanged()));
	}

	return { from: fromPosition, to: toPosition };
}

let lastReadPositioning = null;
async function hasTileGridChanged() {
	try {
		const response = await fetchArduino("REQ:READ:");
		const boardPositioning = hexToBinary64(response.data.split(",")[1]);
		if (lastReadPositioning !== null && lastReadPositioning !== boardPositioning) {
			const changedPosition = getChangedPosition(lastReadPositioning, boardPositioning);
			lastReadPositioning = null; //reset for next call
			return changedPosition;
		}
		lastReadPositioning = boardPositioning;
		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
}

function getChangedPosition(pos1, pos2) {
	const num1 = BigInt("0b" + pos1);
	const num2 = BigInt("0b" + pos2);

	const position_int = concatZeroUntilSizeMatches((num1 ^ num2).toString(2), 64).indexOf(1); //because of the xor, theres a 1 only at the changed position
	const xPositionStr = String.fromCharCode("a".charCodeAt(0) + (position_int % 8));
	const yPositionStr = parseInt(position_int / 8) + 1;
	const positionInChessNotation = xPositionStr + yPositionStr;
	return positionInChessNotation;
}

function hexToBinary64(hex) {
	const num = BigInt("0x" + hex);
	const binaryString = concatZeroUntilSizeMatches(num.toString(2), 64);
	return binaryString.slice(-64); // Ensure it's exactly 64 bits
}

function concatZeroUntilSizeMatches(input, size) {
	while (input.length < size) {
		input = "0" + input;
	}
	return input;
}
