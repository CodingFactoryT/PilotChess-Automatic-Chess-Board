import WebSocketController from "@src/controllers/WebSocketController";
import Stream from "./Stream";
import config from "@shared/config";
import { Chess } from "chess.js";
import VirtualBoardController from "@src/controllers/VirtualBoardController";
import LichessUserController from "@src/controllers/LichessControllers/LichessUserController";
import PhysicalBoardController from "../PhysicalBoardController";

export default class GameStream extends Stream {
	private static instance : GameStream | null;
	private gameId : string;
	private readonly events = {
		GAME_FULL: "gameFull",
		GAME_STATE: "gameState",
		CHAT_LINE: "chatLine",
		OPPONENT_GONE: "opponentGone",
	}

	constructor(gameId: string, initialFen: string) {
		const url = `${config.lichess_base_url}/api/board/game/stream/${gameId}`;

		if (GameStream.instance) {
			throw new Error("Use GameStream.getInstance() instead of new.");
		}

		super(
			"GameStream",
			url,
			(data: object) => this.#handleData(<GameStreamEvent>data),
			(error: string) => this.#handleError(error)
		);

		this.gameId = gameId;

		GameStream.instance = this;
		VirtualBoardController.setFen(initialFen);
	}

	override stop() {
		super.stop();
		GameStream.instance = null;
	}

	static getInstance(gameId: string, initialFen: string) {
		if (!GameStream.instance) {
			GameStream.instance = new GameStream(gameId, initialFen);
		}

		return GameStream.instance;
	}

	getGameId() {
		return this.gameId;
	}

	#handleData(data: GameStreamEvent) {
		switch (data.type) {
			case this.events.GAME_FULL:
				return this.#handleGameFull(<GameFullEvent>data);
			case this.events.GAME_STATE:
				return this.#handleGameState(<GameStateEvent>data);
			case this.events.CHAT_LINE:
				return this.#handleChatLine(<ChatLineEvent>data);
			case this.events.OPPONENT_GONE:
				return this.#handleOpponentGone(<OpponentGoneEvent>data);
			default:
				return console.error(`Stream "${super.getName()}": Unknown incoming data type "${data.type}"`);
		}
	}

	// eslint-disable-next-line no-unused-vars
	#handleGameFull(data: GameFullEvent) {} //ignore as it does not provide information that isn't send by the gameStart-event in the MainEventStream

	#handleGameState(data: GameStateEvent) {
		const tmpBoard = new Chess();
		const moves = data.moves.split(" ");
		moves.forEach((move: string) => {
			tmpBoard.move(move);
		});

		const newFen = tmpBoard.fen();
		const lastMove = moves.at(-1)!;
		if (VirtualBoardController.getInstance().compareFen(newFen)) return;

		WebSocketController.getInstance().send({
			type: "pieceMoved",
			data: {
				id: this.gameId,
				fen: newFen,
			},
		});

		const wasOpponentsTurn = !VirtualBoardController.getInstance().isMyTurn();
		console.log(`Was opponents turn: ${wasOpponentsTurn}`);
		const pieceType = VirtualBoardController.getInstance().getPieceAtPosition(lastMove.substring(0, 2)).type;
		console.log(`PieceType: ${pieceType}`);
		const moveInformation = VirtualBoardController.getInstance().move(lastMove);
		console.log(`Move: ${lastMove}`);
		console.log(moveInformation);

		if (wasOpponentsTurn) {
			//don't handle my moves as they were already executed by hand
			PhysicalBoardController.getInstance()
				.movePiece(lastMove, pieceType, moveInformation)
				.then(() => {
					//after the opponent's turn, it's my turn
					//TODO don't execute if game is over
					PhysicalBoardController.getInstance().waitForPieceMovementAndSendToLichess();
				});
		}
	}

	#handleChatLine(data: ChatLineEvent) {
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

	#handleOpponentGone(data: OpponentGoneEvent) {
		console.log(data);
	}

	#handleError(error: string) {
		console.error(error);
	}
}
