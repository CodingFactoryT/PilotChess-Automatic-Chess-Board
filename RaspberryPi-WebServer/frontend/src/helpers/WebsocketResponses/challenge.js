import WebSocketController from "../../controller/WebSocketController";

export function acceptChallenge(challengeId) {
	WebSocketController.send({
		type: "challengeAccepted",
		data: {
			id: challengeId,
		},
	});
}

export function declineChallenge(challengeId) {
	WebSocketController.send({
		type: "challengeDeclined",
		data: {
			id: challengeId,
		},
	});
}
