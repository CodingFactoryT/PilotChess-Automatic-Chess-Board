import fetchArduino from "../services/ArduinoCommunicator.js";
import { hexToBinary64, concatZeroesUntilSizeMatches } from "../helpers/util.js";
import { BISHOP, Chess, KING, KNIGHT, PAWN, QUEEN, ROOK } from "chess.js";

export default class BoardController {
	static #instance = null;
	static #fen = null;

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
			BoardController.#instance = new BoardController(BoardController.#fen);
		}

		return BoardController.#instance;
	}

	static setFen(fen) {
		BoardController.#fen = fen;
	}

	/**
	 * move: e.g. "a2a3"
	 */
	async moveOpponentsPiece(move) {
		const fromPosition = move.substring(0, 2);
		const toPosition = move.substring(2, 4);
		const pieceToMove = this.board.get(fromPosition);
		switch (pieceToMove.type) {
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
		this.board.move({ from: fromPosition, to: toPosition });
	}

	async #movePawn(fromPosition, toPosition) {
		await this.#moveWithoutFurtherLogic(fromPosition, toPosition);
	}

	/**
	 * Tries to move the knight without moving another piece first.
	 * If thats's not possible, it moves a helper piece to a corner, moves the knight, and the moves the helper piece back
	 */
	async #moveKnight(fromPosition, toPosition) {
		const helperPiecePositions = this.calculateKnightHelperPiecePositions(fromPosition, toPosition);

		//if the tile near the from-position is empty
		if (!this.board.get(helperPiecePositions.nearFromPositionFrom)) {
			return await this.#moveWithStopovers(fromPosition, [helperPiecePositions.nearFromPositionFrom], toPosition);
		}

		//if the tile near the to-position is empty
		if (!this.board.get(helperPiecePositions.nearToPositionFrom)) {
			return await this.#moveWithStopovers(fromPosition, [helperPiecePositions.nearToPositionFrom], toPosition);
		}

		//if none of the tiles is empty, a helper piece has to be moved
		//one position (near from or near to) is always valid
		let helperFromPositionToUse = helperPiecePositions.nearFromPositionFrom;
		let helperToPositionToUse = helperPiecePositions.nearFromPositionTo;
		if (!this.validatePiecePosition(helperToPositionToUse)) {
			helperFromPositionToUse = helperPiecePositions.nearToPositionFrom;
			helperToPositionToUse = helperPiecePositions.nearToPositionTo;
		}

		await this.#moveWithoutFurtherLogic(helperFromPositionToUse, helperToPositionToUse);
		await this.#moveWithStopovers(fromPosition, [helperFromPositionToUse], toPosition);
		await this.#moveWithoutFurtherLogic(helperToPositionToUse, helperFromPositionToUse);
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
		try {
			await fetchArduino(`REQ:RELS:`);
			await fetchArduino(`REQ:MOVE:${fromPosition}`);
			await fetchArduino(`REQ:GRAB:`);
			for (const stopOverPosition of stopOverPositions) {
				await fetchArduino(`REQ:MOVE:${stopOverPosition}`);
			}
			await fetchArduino(`REQ:MOVE:${toPosition}`);
			await fetchArduino(`REQ:RELS:`);
		} catch (error) {
			console.error("Couldn't physically move the piece: " + error);
		}
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

	#addPositionRelative(pos, delta) {
		const posX = pos.charCodeAt(0);
		const posY = pos.charCodeAt(1);
		const newPosX = String.fromCharCode(posX + delta.x);
		const newPosY = String.fromCharCode(posY + delta.y);
		return newPosX + newPosY;
	}

	validatePiecePosition(position) {
		if (!(position.length === 2 || position.length === 3)) return false;

		const x = position.charCodeAt(0);
		const y = Number(position.charAt(1));
		if (!y) return false;
		const isXYValid = x >= "a".charCodeAt(0) && x <= "h".charCodeAt(0) && y >= 1 && y <= 8;

		if (position.length === 2) return isXYValid;

		//else the position is on the edge of two or four tiles

		const edgeAppendix = Number(position.charAt(2));
		if (!edgeAppendix) return false;
		return !((y === 1 && edgeAppendix <= 3) || (y === 8 && edgeAppendix >= 7));
	}

	calculateKnightHelperPiecePositions(knightFromPosition, knightToPosition) {
		const delta = this.getPositionDelta(knightFromPosition, knightToPosition);
		let nearFromDelta = { x: Math.ceil(delta.x / 2), y: Math.ceil(delta.y / 2) };
		let nearToDelta = { x: Math.floor(delta.x / 2), y: Math.floor(delta.y / 2) };

		if (delta.x === 1 || delta.y === 1) {
			const tmpDelta = nearFromDelta;
			nearFromDelta = nearToDelta;
			nearToDelta = tmpDelta;
		}

		const nearFromPositionFrom = this.#addPositionRelative(knightFromPosition, nearFromDelta);
		const nearToPositionFrom = this.#addPositionRelative(knightFromPosition, nearToDelta);

		let nearFromPositionTo = nearFromPositionFrom;
		let nearToPositionTo = nearToPositionFrom;

		switch (delta.x + "|" + delta.y) {
			case "1|-2": //fallthrough
			case "-2|1":
				nearFromPositionTo += "1";
				nearToPositionTo += "9";
				break;
			case "-1|2": //fallthrough
			case "2|-1":
				nearFromPositionTo += "9";
				nearToPositionTo += "1";
				break;
			case "-1|-2": //fallthrough
			case "2|1":
				nearFromPositionTo += "3";
				nearToPositionTo += "7";
				break;
			case "1|2": //fallthrough
			case "-2|-1":
				nearFromPositionTo += "7";
				nearToPositionTo += "3";
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
