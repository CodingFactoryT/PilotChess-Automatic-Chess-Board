import WebSocketController from "./WebSocketController.js";

export function handleIncomingData(data) {
	switch (data.type) {
		case "gameStart":
			return handleGameStart(data);
		case "gameFinish":
			return handleGameFinish(data);
		case "challenge":
			return handleChallenge(data);
		case "challengeCanceled":
			return handleChallengeCancelled(data);
		case "challengeDeclined":
			return handleChallengeDeclined(data);
		default:
			return console.error(`Unknown user stream data type: ${data.type}`);
	}
}

function handleGameStart(data) {}

function handleGameFinish(data) {}

function handleChallenge(data) {
	WebSocketController.get().send({
		type: "challenge",
		data: {
			id: data.challenge.id,
			challenger: data.challenge.challenger.name,
			variant: data.challenge.variant.name,
			rated: data.challenge.rated,
			speed: data.challenge.speed,
			timeControl: data.timeControl,
		},
	});
}

function handleChallengeCancelled(data) {
	WebSocketController.get().send({
		type: "challengeCanceled",
		data: {
			id: data.challenge.id,
		},
	});
}

function handleChallengeDeclined(data) {
	console.log("Challenge declined!");
}
