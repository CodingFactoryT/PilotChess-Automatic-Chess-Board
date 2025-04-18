import fetchArduino from "../services/ArduinoCommunicator.js";
import { hexToBinary64, concatZeroesUntilSizeMatches } from "../helpers/util.js";
import { BISHOP, Chess, KING, KNIGHT, PAWN, QUEEN, ROOK } from "chess.js";

export default class BoardController {
	static #instance = null;

	constructor(fen) {
		if (BoardController.#instance) {
			throw new Error("Use BoardController.getInstance() instead of new.");
		}

		this.lastReadPositioning = null;
		this.board = new Chess(fen);
		BoardController.#instance = this;
	}

	static getInstance() {
		if (!BoardController.#instance) {
			BoardController.#instance = new BoardController(this.fen);
		}

		return BoardController.#instance;
	}

	static setFen(fen) {
		this.fen = fen;
	}

	/**
	 * move: e.g. "a2a3"
	 */
	async moveOpponentsPiece(move) {
		const fromPosition = move.substring(0, 2);
		const toPosition = move.substring(2, 4);
		const pieceToMove = this.board.get(fromPosition);
		switch (pieceToMove) {
			case PAWN:
				return await this.#movePawn(fromPosition, toPosition);
			case KNIGHT:
				return await this.#moveKnight(fromPosition, toPosition);
			case BISHOP:
				return await this.#moveBishop(fromPosition, toPosition);
			case ROOK:
				return await this.#moveRook(fromPosition, toPosition);
			case QUEEN:
				return await this.#moveQueen(fromPosition, toPosition);
			case KING:
				return await this.#moveKing(fromPosition, toPosition);
			default:
				return console.error("The tile from which the piece is to be moved is empty! The piece movement detection algorithm made a mistake!");
		}
	}

	async #movePawn(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	/**
	 * Tries to move the knight without moving another piece first.
	 * If thats's not possible, it moves a helper piece to a corner, moves the knight, and the moves the helper piece back
	 */
	async #moveKnight(fromPosition, toPosition) {
		const delta = this.getPositionDelta(fromPosition, toPosition);
		const firstTryDeltaX = Math.abs(delta.x) == 2 ? Math.sign(delta.x) : 0;
		const firstTryDeltaY = Math.abs(delta.y) == 2 ? Math.sign(delta.y) : 0;
		const firstTryPosition = this.#addPositionRelative(fromPosition, firstTryDeltaX, firstTryDeltaY);

		//if the tile at the first guessed location is empty, move the knight by first moving orthogonal and then diagonal
		if (!this.board.get(firstTryPosition)) {
			return await this.#moveWithStopovers(fromPosition, [firstTryPosition], toPosition);
		}

		//else: first move diagonal, then orthogonal

		const secondTryDeltaX = Math.sign(delta.x);
		const secondTryDeltaY = Math.sign(delta.y);
		const secondTryPosition = this.#addPositionRelative(fromPosition, secondTryDeltaX, secondTryDeltaY);
		if (!this.board.get(firstTryPosition)) {
			return await this.#moveWithStopovers(fromPosition, [secondTryPosition], toPosition);
		}

		//if none of the available tiles is empty, a helper piece (the one on the second tries position) has to be moved in order to move the knight to its destination
		const helperPieceFromPosition = secondTryPosition;
		const deltaStr = delta.x + "|" + delta.y;
		let positionAppendix = "";

		switch (deltaStr) {
			case "-2|1":
			case "1|-2":
				positionAppendix = 1;
				break;
			case "2|1":
			case "-1|-2":
				positionAppendix = 3;
				break;
			case "1|2":
			case "-2|-1":
				positionAppendix = 7;
				break;
			case "2|-1":
			case "-1|2":
				positionAppendix = 9;
				break;
		}
		const helperPieceToPosition = helperPieceFromPosition + positionAppendix;

		await this.#moveWithoutFurtherLogic(helperPieceFromPosition, helperPieceToPosition); //move the helper piece out of the way
		await this.#moveWithStopovers(fromPosition, [helperPieceFromPosition], toPosition); //move the knight
		await this.#moveWithoutFurtherLogic(helperPieceToPosition, helperPieceFromPosition); //move the helper piece back to its original position
	}

	async #moveBishop(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	async #moveRook(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	async #moveQueen(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	async #moveKing(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	async #moveWithoutFurtherLogic(fromPosition, toPosition) {
		await this.#moveWithStopovers(fromPosition, [], toPosition);
	}

	async #moveWithStopovers(fromPosition, stopOverPositions, toPosition) {
		await fetchArduino(`REQ:RELS:`);
		await fetchArduino(`REQ:MOVE:${fromPosition}`);
		await fetchArduino(`REQ:GRAB:`);
		for (stopOverPosition in stopOverPositions) {
			await fetchArduino(`REQ:MOVE:${stopOverPosition}`);
		}
		await fetchArduino(`REQ:MOVE:${toPosition}`);
		await fetchArduino(`REQ:RELS:`);
		this.board.move(fromPosition, toPosition);
	}

	async waitForPieceMovement() {
		let fromPosition = null;
		let toPosition = null;

		while (fromPosition === toPosition) {
			while (!(fromPosition = await this.hasTileGridChanged()));
			while (!(toPosition = await this.hasTileGridChanged()));
		}

		return { from: fromPosition, to: toPosition };
	}

	async #hasTileGridChanged() {
		try {
			const response = await fetchArduino("REQ:READ:");
			const boardPositioning = hexToBinary64(response.data.split(",")[1]);
			if (lastReadPositioning !== null && lastReadPositioning !== boardPositioning) {
				const changedPosition = getChangedPosition(lastReadPositioning, boardPositioning);
				lastReadPositioning = null; //reset for next call
				return changedPosition;
			}
			lastReadPositioning = boardPositioning;
			return null;
		} catch (error) {
			console.log(error);
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

	getPositionDelta(from, to) {
		const fromX = from.charCodeAt(0);
		const fromY = from.charAt(1);
		const toX = to.charCodeAt(0);
		const toY = to.charAt(1);

		const deltaX = toX - fromX;
		const deltaY = toY - fromY;

		return { x: deltaX, y: deltaY };
	}

	#addPositionRelative(pos, relX, relY) {
		const posX = pos.charCodeAt(0);
		const posY = pos.charCodeAt(1);
		const newPosX = String.fromCharCode(posX + relX);
		const newPosY = String.fromCharCode(posY + relY);
		return newPosX + newPosY;
	}
}
