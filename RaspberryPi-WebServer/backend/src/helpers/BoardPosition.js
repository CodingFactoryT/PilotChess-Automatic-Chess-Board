/**
 * Represents a tile position on a chessboard
 * it has the following components:
 * x - the x-coordinate (a-h) on the chessboard
 * y - the y-coordinate (1-8) on the chessboard
 * appendix - this is a number (1-9) used for a finer positioning of the physically moved pieces on the actual real-life board
 *            It represents half-step-positions like center (5), top left (1), bottom center (2), ... relative to the stored position/x- and y-components.
 *            The direction represented by the appendix can be read from a standard numpad:
 *            7 8 9     ↖ ↑ ↗
 *            4 5 6     ← • →
 *            1 2 3     ↙ ↓ ↘
 */
export default class BoardPosition {
	/**
	 *
	 * @param {string} x
	 * @param {number} y
	 * @param {number} appendix default value is 5, which represents the center of a tile
	 */
	constructor(x, y, appendix = 5) {
		if (!BoardPosition.isValid(x, y, appendix)) {
			throw new Error(`Invalid parameters for class BoardPosition: x=${x}, y=${y}, appendix=${appendix}`);
		}

		this.x = x;
		this.y = y;
		this.appendix = appendix;
	}

	/**
	 * Adds a given delta to the current BoardPosition
	 * @param {object} delta an object containing x and y which represent deltaX and deltaX as a number
	 * @returns A new BoardPosition with the applied delta
	 */
	addDelta(delta) {
		const newX = String.fromCharCode(this.getX().charCodeAt(0) + delta.x);
		const newY = this.getY() + delta.y;

		console.log(`Delta: ${delta}`);
		console.log(`NewX: ${newX}, NewY ${newY}`);

		if (!BoardPosition.isValid(newX, newY, this.getAppendix())) {
			throw new Error("The delta results in a position that lies outside of the board!");
		}

		return new BoardPosition(newX, newY, this.getAppendix());
	}

	/**
	 * The object that the method is called on is the "from" position, the parameter is the "to" position
	 * @param {BoardPosition} pos2
	 * @returns an object containing the x and y delta of the two positions
	 */
	getDelta(pos2) {
		const fromXCharCode = this.getX().charCodeAt(0);
		const fromY = this.getY();
		const toXCharCode = pos2.getX().charCodeAt(0);
		const toY = pos2.getY();

		const deltaX = toXCharCode - fromXCharCode;
		const deltaY = toY - fromY;

		return { x: deltaX, y: deltaY };
	}

	/**
	 * Checks if the components for a BoardPosition are valid
	 * @param {string} x
	 * @param {number} y
	 * @param {number} appendix
	 * @returns {boolean} true if all components are valid, false otherwise
	 */
	static isValid(x, y, appendix = 5) {
		return BoardPosition.#validateX(x) && BoardPosition.#validateY(y) && BoardPosition.#validateAppendix(appendix);
	}

	/**
	 * Checks if the x-component for a BoardPosition is valid
	 * @param {string} x
	 * @returns {boolean} true if valid, false otherwise
	 */
	static #validateX(x) {
		return x.length == 1 && x.charCodeAt(0) >= "a".charCodeAt(0) && x.charCodeAt(0) <= "h".charCodeAt(0);
	}

	/**
	 * Checks if the y-component for a BoardPosition is valid
	 * @param {number} y
	 * @returns {boolean} true if valid, false otherwise
	 */
	static #validateY(y) {
		return Number.isInteger(y) && y >= 1 && y <= 8;
	}

	/**
	 * Checks if the appendix-component for a BoardPosition is valid
	 * @param {number} appendix
	 * @returns {boolean} true if valid, false otherwise
	 */
	static #validateAppendix(appendix) {
		return Number.isInteger(appendix) && appendix >= 1 && appendix <= 9;
	}

	/**
	 * @returns {string}
	 */
	getX() {
		return this.x;
	}

	/**
	 * @returns {number}
	 */
	getY() {
		return this.y;
	}

	/**
	 * @returns {number}
	 */
	getAppendix() {
		return this.appendix;
	}

	setAppendix(appendix) {
		if (!BoardPosition.#validateAppendix(appendix)) throw new Error(`The given appendix is not valid: ${appendix}`);
		this.appendix = appendix;
	}

	/**
	 * @returns {string}
	 */
	toChessNotationString() {
		return this.getX() + String(this.getY());
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.toChessNotationString() + String(this.getAppendix());
	}
}
