import { Chess, Color, Square } from "chess.js";
import { ChildProcessWithoutNullStreams } from "child_process";

export default class VirtualBoardController {
	private static instance : VirtualBoardController;
	private static fen: string | undefined = undefined;
	private static myColor : Color = "w";
	private board: Chess;

	constructor(fen: string | undefined) {
		if (VirtualBoardController.instance) {
			throw new Error("Use VirtualBoardController.getInstance() instead of new.");
		}

		this.board = new Chess(fen);
		VirtualBoardController.instance = this;
	}

	static getInstance() {
		if (!VirtualBoardController.instance) {
			VirtualBoardController.instance = new VirtualBoardController(VirtualBoardController.fen);
		}

		return VirtualBoardController.instance;
	}

	static setFen(fen: string | undefined) {
		VirtualBoardController.fen = fen;
	}

	static setMyColor(color: Color) {
		if (color !== "w" && color != "b") throw new Error(`Your Board-Color could not be set: "${color}" doesn't match "b" or "w"`);

		VirtualBoardController.myColor = color;
	}

	static doIBegin() {
		return VirtualBoardController.myColor === "w";
	}

	isMyTurn() {
		return this.board.turn() === VirtualBoardController.myColor;
	}

	/**
	 *
	 * @param {string} fen
	 * @returns true if the board positions are the same, false otherwise
	 */
	compareFen(fen: string) {
		return this.board.fen() === fen;
	}

	getPieceAtPosition(position: Square | undefined) {
		if(!position) return undefined;
		return this.board.get(position);
	}

	move(move: string) {
		return this.board.move({ from: move.substring(0, 2), to: move.substring(2, 4) });
	}
}
