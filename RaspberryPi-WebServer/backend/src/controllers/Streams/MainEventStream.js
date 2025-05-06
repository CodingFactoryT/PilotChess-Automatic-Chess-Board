import WebSocketController from "@src/controllers/WebSocketController.js";
import Stream from "./Stream.js";
import config from "@shared/config.js";
import GameStream from "./GameStream.js";

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

	#handleGameStart(data) {
		const game = data.game;
		GameStream.getInstance(game.gameId, game.fen).listen();
		WebSocketController.getInstance().send({
			type: this.Events.GAME_START,
			data: {
				id: game.gameId,
				color: game.color,
				fen: game.fen,
				opponent: {
					username: game.opponent.username,
					rating: game.opponent.rating,
				},
				secondsLeft: data.game.secondsLeft,
			},
		});
	}

	#handleGameFinish(data) {
		GameStream.getInstance(data.game.gameId).stop();
	}

	#handleChallenge(data) {
		WebSocketController.getInstance().send({
			type: this.Events.CHALLENGE,
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
			type: this.Events.CHALLENGE_CANCELED,
			data: {
				id: data.challenge.id,
			},
		});
	}

	#handleChallengeDeclined(data) {}

	#handleError(error) {}
}
