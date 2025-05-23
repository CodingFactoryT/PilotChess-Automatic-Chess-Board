export function hexToBinary64(hex: number) {
	const num = BigInt("0x" + hex);
	const binaryString = concatZeroesUntilSizeMatches(num.toString(2), 64);
	return binaryString.slice(-64); // Ensure it's exactly 64 bits
}

export function concatZeroesUntilSizeMatches(input: string, size: number) {
	while (input.length < size) {
		input = "0" + input;
	}
	return input;
}
