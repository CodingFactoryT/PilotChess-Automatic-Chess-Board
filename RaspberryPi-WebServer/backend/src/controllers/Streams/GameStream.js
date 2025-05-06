import WebSocketController from "../WebSocketController.js";
import Stream from "./Stream.js";
import config from "../../../../config.js";
import { Chess } from "chess.js";
import BoardController from "../BoardController.js";
import LichessUserController from "../LichessControllers/LichessUserController.js";

export default class GameStream extends Stream {
	static #instance = null;
	static name = "GameStream";

	constructor(gameId, initialFen) {
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

		this.gameId = gameId;
		this.board = new Chess(initialFen);

		this.Events = {
			GAME_FULL: "gameFull",
			GAME_STATE: "gameState",
			CHAT_LINE: "chatLine",
			OPPONENT_GONE: "opponentGone",
		};

		GameStream.#instance = this;
		BoardController.setFen(initialFen);
	}

	stop() {
		super.stop();
		GameStream.#instance = null;
	}

	static getInstance(gameId, initialFen) {
		if (!GameStream.#instance) {
			GameStream.#instance = new GameStream(gameId, initialFen);
		}

		return GameStream.#instance;
	}

	getGameId() {
		return this.gameId;
	}

	#handleData(data) {
		const Events = this.Events;

		switch (data.type) {
			case Events.GAME_FULL:
				return this.#handleGameFull(data);
			case Events.GAME_STATE:
				return this.#handleGameState(data);
			case Events.CHAT_LINE:
				return this.#handleChatLine(data);
			case Events.OPPONENT_GONE:
				return this.#handleOpponentGone(data);
			default:
				return console.error(`Stream "${this.name}": Unknown incoming data type "${data.type}"`);
		}
	}

	#handleGameFull(data) {} //ignore as it does not provide information that isn't send by the gameStart-event in the MainEventStream

	#handleGameState(data) {
		const prevFen = this.board.fen();
		this.board = new Chess();
		const moves = data?.moves?.split(" ");
		moves.forEach((move) => {
			this.board.move(move);
		});

		const newFen = this.board.fen();
		if (prevFen === newFen) return;

		const lastMove = moves.at(-1);

		WebSocketController.getInstance().send({
			type: "pieceMoved",
			data: {
				id: this.gameId,
				move: lastMove,
				fen: newFen,
			},
		});

		BoardController.getInstance().movePiecePhysically(lastMove);
	}

	#handleChatLine(data) {
		if (data.room === "player") {
			const dataUsername = data.username;
			LichessUserController.fetchLoggedInUsername()
				.then((loggedInUsername) => {
					WebSocketController.getInstance().send({
						type: "chat",
						data: {
							username: dataUsername,
							isMe: dataUsername === loggedInUsername,
							message: data.text,
						},
					});
				})
				.catch((error) => {
					console.error(`Error while handling chat message from ${dataUsername}: ${error}`);
				});
		}
	}

	#handleOpponentGone(data) {
		console.log(data);
	}

	#handleError(error) {
		console.error(error);
	}
}
