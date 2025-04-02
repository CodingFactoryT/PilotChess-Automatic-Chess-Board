import WebSocketController from "./WebSocketController.js";
import Stream from "./Stream.js";
import config from "../../../../config.js";

export default class GameStream extends Stream {
	static #instance = null;
	static name = "GameStream";

	constructor(gameId) {
		const url = `${config.lichess_base_url}/api/board/game/stream/${gameId}`;

		if (GameStream.#instance) {
			throw new Error("Use GameStream.getInstance() instead of new.");
		}

		super(
			GameStream.name,
			url,
			(data) => this.#handleData(data),
			(error) => this.#handleError(error)
		);

		this.Events = {
			GAME_FULL: "gameFull",
			GAME_STATE: "gameState",
			CHAT_LINE: "chatLine",
			OPPONENT_GONE: "opponentGone",
		};

		GameStream.#instance = this;
	}

	static getInstance() {
		if (!GameStream.#instance) {
			GameStream.#instance = new GameStream();
		}

		return GameStream.#instance;
	}

	#handleData(data) {
		const Events = this.Events;

		switch (data.type) {
			case Events.GAME_FULL:
				return this.#handleGameFull();
			case Events.GAME_STATE:
				return this.#handleGameState();
			case Events.CHAT_LINE:
				return this.#handleChatLine();
			case Events.OPPONENT_GONE:
				return this.#handleOpponentGone();
			default:
				return console.error(`Stream "${this.name}": Unknown incoming data type "${data.type}"`);
		}
	}

	#handleGameFull(data) {}

	#handleGameState(data) {}

	#handleChatLine(data) {}

	#handleOpponentGone(data) {}

	#handleError(error) {}
}
