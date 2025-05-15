import WebSocketController from "@src/controllers/WebSocketController";
import Stream from "./Stream";
import config from "@shared/config";
import GameStream from "./GameStream";
import VirtualBoardController from "../VirtualBoardController";
import PhysicalBoardController from "../PhysicalBoardController";

export default class MainEventStream extends Stream {
	private static instance : MainEventStream;
	private static url = `${config.lichess_base_url}/api/stream/event`;
	private readonly events = {
		GAME_START: "gameStart",
		GAME_FINISH: "gameFinish",
		CHALLENGE: "challenge",
		CHALLENGE_CANCELED: "challengeCanceled",
		CHALLENGE_DECLINED: "challengeDeclined",
	}

	constructor() {
		if (MainEventStream.instance) {
			throw new Error("Use MainEventStream.getInstance() instead of new.");
		}

		super(
			"MainEventStream",
			MainEventStream.url,
			(data) => this.#handleData(data),
			(error) => this.#handleError(error)
		);

		MainEventStream.instance = this;
	}

	static getInstance() {
		if (!MainEventStream.instance) {
			MainEventStream.instance = new MainEventStream();
		}

		return MainEventStream.instance;
	}

	#handleData(data) {
		switch (data.type) {
			case this.events.GAME_START:
				return this.#handleGameStart(data);
			case this.events.GAME_FINISH:
				return this.#handleGameFinish(data);
			case this.events.CHALLENGE:
				return this.#handleChallenge(data);
			case this.events.CHALLENGE_CANCELED:
				return this.#handleChallengeCanceled(data);
			case this.events.CHALLENGE_DECLINED:
				return this.#handleChallengeDeclined(data);
			default:
				return console.error(`Stream "${super.getName()}": Unknown incoming data type "${data.type}"`);
		}
	}

	#handleGameStart(data) {
		const game = data.game;
		GameStream.getInstance(game.gameId, game.fen).listen();
		VirtualBoardController.setMyColor(game.color[0]);
		WebSocketController.getInstance().send({
			type: "gameStart",
			data: {
				id: game.gameId,
				color: game.color,
				fen: game.fen,
				opponent: {
					username: game.opponent.username,
					rating: game.opponent.rating,
				},
				secondsLeft: game.secondsLeft,
			},
		});

		if (VirtualBoardController.doIBegin()) {
			//TODO not completely correct: if I am black and I jump into a running game where it's my turn, this won't trigger
			PhysicalBoardController.getInstance().waitForPieceMovementAndSendToLichess();
		}
	}

	//TODO handle last move before check-mate, as this move is not sent via GameState
	#handleGameFinish(data) {
		GameStream.getInstance(data.game.gameId).stop();
	}

	#handleChallenge(data) {
		WebSocketController.getInstance().send({
			type: this.events.CHALLENGE,
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
			type: this.events.CHALLENGE_CANCELED,
			data: {
				id: data.challenge.id,
			},
		});
	}

	#handleChallengeDeclined(data) {
		console.log(data);
	}

	#handleError(error) {
		console.error(error);
	}
}
