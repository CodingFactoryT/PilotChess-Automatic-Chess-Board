import WebSocketController from "./WebSocketController.js";
import Stream from "./Stream.js";
import config from "../../../../config.js";

export default class MainEventStream extends Stream {
	static #instance = null;
	static name = "MainEventStream";
	static url = `${config.lichess_base_url}/api/stream/event`;

	constructor() {
		if (MainEventStream.#instance) {
			throw new Error("Use MainEventStream.getInstance() instead of new.");
		}

		super(
			MainEventStream.name,
			MainEventStream.url,
			(data) => this.#handleData(data),
			(error) => this.#handleError(error)
		);

		this.Events = {
			GAME_START: "gameStart",
			GAME_FINISH: "gameFinish",
			CHALLENGE: "challenge",
			CHALLENGE_CANCELED: "challengeCanceled",
			CHALLENGE_DECLINED: "challengeDeclined",
		};

		MainEventStream.#instance = this;
	}

	static getInstance() {
		if (!MainEventStream.#instance) {
			MainEventStream.#instance = new MainEventStream();
		}

		return MainEventStream.#instance;
	}

	#handleData(data) {
		const Events = this.Events;

		switch (data.type) {
			case Events.GAME_START:
				return this.#handleGameStart(data);
			case Events.GAME_FINISH:
				return this.#handleGameFinish(data);
			case Events.CHALLENGE:
				return this.#handleChallenge(data);
			case Events.CHALLENGE_CANCELED:
				return this.#handleChallengeCanceled(data);
			case Events.CHALLENGE_DECLINED:
				return this.#handleChallengeDeclined(data);
			default:
				return console.error(`Stream "${this.name}": Unknown incoming data type "${data.type}"`);
		}
	}

	#handleGameStart(data) {}

	#handleGameFinish(data) {}

	#handleChallenge(data) {
		WebSocketController.getInstance().send({
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

	#handleChallengeCanceled(data) {
		WebSocketController.getInstance().send({
			type: "challengeCanceled",
			data: {
				id: data.challenge.id,
			},
		});
	}

	#handleChallengeDeclined(data) {}

	#handleError(error) {}
}
