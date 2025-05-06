import { Chess } from "chess.js";

export default class VirtualBoardController {
	static #instance = null;
	static #fen = null;

	constructor(fen) {
		if (VirtualBoardController.#instance) {
			throw new Error("Use VirtualBoardController.getInstance() instead of new.");
		}

		this.board = new Chess(fen);
		VirtualBoardController.#instance = this;
	}

	static getInstance() {
		if (!VirtualBoardController.#instance) {
			VirtualBoardController.#instance = new VirtualBoardController(VirtualBoardController.#fen);
		}

		return VirtualBoardController.#instance;
	}

	static setFen(fen) {
		VirtualBoardController.#fen = fen;
	}

	/**
	 *
	 * @param {string} fen
	 * @returns true if the board positions are the same, false otherwise
	 */
	compareFen(fen) {
		return this.board.fen() === fen;
	}

	getPieceAtPosition(position) {
		return this.board.get(position);
	}

	move(move) {
		return this.board.move({ from: move.substring(0, 2), to: move.substring(2, 4) });
	}
}
