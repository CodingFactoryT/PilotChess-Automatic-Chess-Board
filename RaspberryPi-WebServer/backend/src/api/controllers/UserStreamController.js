export function handleIncomingData(data) {
	switch (data.type) {
		case "gameStart":
			return handleGameStart(data);
		case "gameFinish":
			return handleGameFinish(data);
		case "challenge":
			return handleChallenge(data);
		case "challengeCancelled":
			return handleChallengeCancelled(data);
		case "challengeDeclined":
			return handleChallengeDeclined(data);
		default:
			return console.log(`Unknown user stream data type: ${data.type}`);
	}
}

function handleGameStart(data) {}

function handleGameFinish(data) {}

function handleChallenge(data) {}

function handleChallengeCancelled(data) {}

function handleChallengeDeclined(data) {}
