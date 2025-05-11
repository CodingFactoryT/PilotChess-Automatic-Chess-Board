import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "chess.js";
import BoardPosition from "@src/helpers/BoardPosition.js";
import VirtualBoardController from "./VirtualBoardController.js";
import LichessGameController from "./LichessControllers/LichessGameController.js";
import GameStream from "./Streams/GameStream.js";
import { concatZeroesUntilSizeMatches, hexToBinary64 } from "@src/helpers/util.js";
import { ArduinoCommunicator } from "@src/services/ArduinoCommunicator.js";

export default class PhysicalBoardController {
	static #instance = null;

	constructor() {
		if (PhysicalBoardController.#instance) {
			throw new Error("Use PhysicalBoardController.getInstance() instead of new.");
		}

		this.lastReadPositioning = null;
		PhysicalBoardController.#instance = this;
	}

	static getInstance() {
		if (!PhysicalBoardController.#instance) {
			PhysicalBoardController.#instance = new PhysicalBoardController();
		}

		return PhysicalBoardController.#instance;
	}

	/**
	 * move: e.g. "a2a3"
	 */
	// eslint-disable-next-line no-unused-vars
	async movePiece(move, pieceType, moveInformation) {
		const fromPosition = new BoardPosition(move[0], Number(move[1]));
		const toPosition = new BoardPosition(move[2], Number(move[3]));

		//TODO: handle special moves, like castling (information if the move is a special move is contained in the move variable)

		switch (pieceType) {
			case PAWN:
				await this.#movePawn(fromPosition, toPosition);
				break;
			case KNIGHT:
				await this.#moveKnight(fromPosition, toPosition);
				break;
			case BISHOP:
				await this.#moveBishop(fromPosition, toPosition);
				break;
			case ROOK:
				await this.#moveRook(fromPosition, toPosition);
				break;
			case QUEEN:
				await this.#moveQueen(fromPosition, toPosition);
				break;
			case KING:
				await this.#moveKing(fromPosition, toPosition);
				break;
			default:
				console.error("The tile from which the piece is to be moved is empty! The piece movement detection algorithm made a mistake!");
				break;
		}
	}

	async #movePawn(fromPosition, toPosition) {
		await this.#executePhysicalMovesInOrder(fromPosition, toPosition);
	}

	/**
	 * Tries to move the knight without moving another piece first.
	 * If thats's not possible, it moves a helper piece to a corner, moves the knight, and the moves the helper piece back
	 */
	async #moveKnight(fromPosition, toPosition) {
		const helperPiecePositions = this.calculateKnightHelperPiecePositions(fromPosition, toPosition);

		//if the tile near the from-position is empty
		if (!VirtualBoardController.getInstance().getPieceAtPosition(helperPiecePositions.nearFromPositionFrom?.toChessNotationString())) {
			return await this.#executePhysicalMovesInOrder(fromPosition, helperPiecePositions.nearFromPositionFrom, toPosition);
		}

		//if the tile near the to-position is empty
		if (!VirtualBoardController.getInstance().getPieceAtPosition(helperPiecePositions.nearToPositionFrom?.toChessNotationString())) {
			return await this.#executePhysicalMovesInOrder(fromPosition, helperPiecePositions.nearToPositionFrom, toPosition);
		}

		//if none of the tiles is empty, a helper piece has to be moved
		//one position (near from or near to) is always valid
		let helperFromPositionToUse = helperPiecePositions.nearFromPositionFrom;
		let helperToPositionToUse = helperPiecePositions.nearFromPositionTo;
		if (!helperToPositionToUse) {
			helperFromPositionToUse = helperPiecePositions.nearToPositionFrom;
			helperToPositionToUse = helperPiecePositions.nearToPositionTo;
		}

		await this.#executePhysicalMovesInOrder(helperFromPositionToUse, helperToPositionToUse);
		await this.#executePhysicalMovesInOrder(fromPosition, helperFromPositionToUse, toPosition);
		await this.#executePhysicalMovesInOrder(helperToPositionToUse, helperFromPositionToUse);
	}

	async #moveBishop(fromPosition, toPosition) {
		await this.#executePhysicalMovesInOrder(fromPosition, toPosition);
	}

	async #moveRook(fromPosition, toPosition) {
		await this.#executePhysicalMovesInOrder(fromPosition, toPosition);
	}

	async #moveQueen(fromPosition, toPosition) {
		await this.#executePhysicalMovesInOrder(fromPosition, toPosition);
	}

	async #moveKing(fromPosition, toPosition) {
		await this.#executePhysicalMovesInOrder(fromPosition, toPosition);
	}

	/**
	 * Executes a sequence of moves one after another for a single piece.
	 *
	 * The piece is grabbed at the first position in the array, is dragged
	 * along the rest of the positions and is released at the last position in the array
	 * @param {BoardPosition} moves
	 */
	async #executePhysicalMovesInOrder(...moves) {
		if (moves.length < 2) return;
		const communicator = ArduinoCommunicator.getInstance();
		console.log(moves);
		console.log(moves[0]);
		console.log(moves[1]);
		try {
			await communicator.fetchArduino(`REQ:RELS:`);
			await communicator.fetchArduino(`REQ:MOVE:${moves[0].toString()}`); //move to the starting position without dragging any piece
			await communicator.fetchArduino(`REQ:GRAB:`);
			for (let i = 1; i < moves.length; i++) {
				await communicator.fetchArduino(`REQ:MOVE:${moves[i].toString()}`);
			}
			await communicator.fetchArduino(`REQ:RELS:`);
		} catch (error) {
			console.error("Couldn't physically move the piece: " + error);
		}
	}

	async waitForPieceMovementAndSendToLichess() {
		console.log("Waiting for previous tasks to finish...");
		await this.#waitForRemainingRequestsToBeFulfilled();
		console.log("All finished!");

		//TODO: endless loop in dev mode
		const data = await this.#waitForPieceMovement();
		const move = data.from + data.to;
		console.log(`Final Move: ${move}`);
		const gameId = GameStream.getInstance().getGameId();
		LichessGameController.makeMove(gameId, move);
	}

	async #waitForRemainingRequestsToBeFulfilled() {
		const communicator = ArduinoCommunicator.getInstance();
		while (communicator.isArduinoBusy()) {
			console.log(`Waiting for ${communicator.getAmountOfTasksToBeFulfilled()} tasks to be fulfilled...`);
			await new Promise((resolve) => setTimeout(resolve, 20)); //check every 20ms if all requests to the Arduino were fulfilled
		}
	}

	async #waitForPieceMovement() {
		let fromPosition = null;
		let toPosition = null;
		this.lastReadPositioning = null; //reset

		while (fromPosition === toPosition) {
			while (!(fromPosition = await this.#hasTileGridChanged()));
			console.log(`From: ${fromPosition}`);
			while (!(toPosition = await this.#hasTileGridChanged()));
			console.log(`To: ${toPosition}`);
		}

		return { from: fromPosition, to: toPosition };
	}

	async #hasTileGridChanged() {
		try {
			const response = await ArduinoCommunicator.getInstance().fetchArduino("REQ:READ:");
			const boardPositioning = hexToBinary64(response.data.split(",")[1]);
			if (this.lastReadPositioning !== null && this.lastReadPositioning !== boardPositioning) {
				const changedPosition = this.#getChangedPosition(this.lastReadPositioning, boardPositioning);
				this.lastReadPositioning = null; //reset for next call
				return changedPosition;
			}
			this.lastReadPositioning = boardPositioning;
			return null;
		} catch (error) {
			console.error(`Error while checking for change in the TileGrid: ${error}`);
			return null;
		}
	}

	#getChangedPosition(pos1, pos2) {
		const num1 = BigInt("0b" + pos1);
		const num2 = BigInt("0b" + pos2);

		const position_int = concatZeroesUntilSizeMatches((num1 ^ num2).toString(2), 64).indexOf(1); //because of the xor, theres a 1 only at the changed position
		const xPositionStr = String.fromCharCode("a".charCodeAt(0) + (position_int % 8));
		const yPositionStr = parseInt(position_int / 8) + 1;
		const positionInChessNotation = xPositionStr + yPositionStr;
		return positionInChessNotation;
	}

	/**
	 *
	 * @param {BoardPosition} knightFromPosition
	 * @param {BoardPosition} knightToPosition
	 * @returns and object containing the from and to positions of the two potential helper pieces
	 */
	calculateKnightHelperPiecePositions(knightFromPosition, knightToPosition) {
		const delta = knightFromPosition.getDelta(knightToPosition);
		let nearFromDelta = { x: Math.ceil(delta.x / 2), y: Math.ceil(delta.y / 2) };
		let nearToDelta = { x: Math.floor(delta.x / 2), y: Math.floor(delta.y / 2) };

		if (delta.x === 1 || delta.y === 1) {
			const tmpDelta = nearFromDelta;
			nearFromDelta = nearToDelta;
			nearToDelta = tmpDelta;
		}

		let nearFromPositionFrom = null;
		let nearToPositionFrom = null;
		let nearFromPositionTo = null;
		let nearToPositionTo = null;

		try {
			nearFromPositionFrom = knightFromPosition.addDelta(nearFromDelta);
			nearFromPositionTo = { ...nearFromPositionFrom };
		} catch (error) {
			console.error(`Error while adding delta to position: ${error}`);
		}

		try {
			nearToPositionFrom = knightFromPosition.addDelta(nearToDelta);
			nearToPositionTo = { ...nearToPositionFrom };
		} catch (error) {
			console.error(`Error while adding delta to position: ${error}`);
		}

		switch (delta.x + "|" + delta.y) {
			case "1|-2": //fallthrough
			case "-2|1":
				nearFromPositionTo?.setAppendix(1);
				nearToPositionTo?.setAppendix(9);
				break;
			case "-1|2": //fallthrough
			case "2|-1":
				nearFromPositionTo?.setAppendix(9);
				nearToPositionTo?.setAppendix(1);
				break;
			case "-1|-2": //fallthrough
			case "2|1":
				nearFromPositionTo?.setAppendix(3);
				nearToPositionTo?.setAppendix(7);
				break;
			case "1|2": //fallthrough
			case "-2|-1":
				nearFromPositionTo?.setAppendix(7);
				nearToPositionTo?.setAppendix(3);
				break;
			default:
				console.error(`No matching delta found (delta: (${delta.x}|${delta.y}))! The algorithm made a mistake!`);
				break;
		}

		return {
			nearFromPositionFrom,
			nearFromPositionTo,
			nearToPositionFrom,
			nearToPositionTo,
		};
	}
}
