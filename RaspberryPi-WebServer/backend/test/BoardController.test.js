import test from "node:test";
import assert from "node:assert/strict";
import BoardController from "@src/api/controllers/BoardController.js";
import { DEFAULT_POSITION } from "chess.js";

test("Validate Position on the board", () => {
	BoardController.setFen(DEFAULT_POSITION);
	const controller = BoardController.getInstance();
	assert.strictEqual(controller.validatePiecePosition("a"), false);
	assert.strictEqual(controller.validatePiecePosition("1"), false);
	assert.strictEqual(controller.validatePiecePosition("g"), false);
	assert.strictEqual(controller.validatePiecePosition("i"), false);
	assert.strictEqual(controller.validatePiecePosition("abc"), false);
	assert.strictEqual(controller.validatePiecePosition("a18e"), false);
	assert.strictEqual(controller.validatePiecePosition("a1d"), false);

	assert.strictEqual(controller.validatePiecePosition("a1"), true);
	assert.strictEqual(controller.validatePiecePosition("b2"), true);
	assert.strictEqual(controller.validatePiecePosition("h8"), true);
	assert.strictEqual(controller.validatePiecePosition("d1"), true);
	assert.strictEqual(controller.validatePiecePosition("g7"), true);

	assert.strictEqual(controller.validatePiecePosition("i1"), false);
	assert.strictEqual(controller.validatePiecePosition("i1"), false);
	assert.strictEqual(controller.validatePiecePosition("k10"), false);
	assert.strictEqual(controller.validatePiecePosition("`1"), false);

	assert.strictEqual(controller.validatePiecePosition("a14"), true);
	assert.strictEqual(controller.validatePiecePosition("a18"), true);
	assert.strictEqual(controller.validatePiecePosition("h19"), true);
	assert.strictEqual(controller.validatePiecePosition("a84"), true);
	assert.strictEqual(controller.validatePiecePosition("a86"), true);
	assert.strictEqual(controller.validatePiecePosition("a81"), true);
	assert.strictEqual(controller.validatePiecePosition("a83"), true);

	assert.strictEqual(controller.validatePiecePosition("a11"), false);
	assert.strictEqual(controller.validatePiecePosition("a12"), false);
	assert.strictEqual(controller.validatePiecePosition("a13"), false);
	assert.strictEqual(controller.validatePiecePosition("c12"), false);
	assert.strictEqual(controller.validatePiecePosition("a87"), false);
	assert.strictEqual(controller.validatePiecePosition("a88"), false);
	assert.strictEqual(controller.validatePiecePosition("a89"), false);
	assert.strictEqual(controller.validatePiecePosition("h88"), false);
	assert.strictEqual(controller.validatePiecePosition("h89"), false);
});

test("Calculate helper piece positions of knight movement", () => {
	BoardController.setFen(DEFAULT_POSITION);
	const controller = BoardController.getInstance();

	//Case: delta = (1|-2)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("a3", "b1"), {
		nearFromPositionFrom: "a2",
		nearFromPositionTo: "a21",
		nearToPositionFrom: "b2",
		nearToPositionTo: "b29",
	});

	//Case: delta = (-1|2)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("b1", "a3"), {
		nearFromPositionFrom: "b2",
		nearFromPositionTo: "b29",
		nearToPositionFrom: "a2",
		nearToPositionTo: "a21",
	});

	//Case: delta = (-1|-2)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("b3", "a1"), {
		nearFromPositionFrom: "b2",
		nearFromPositionTo: "b23",
		nearToPositionFrom: "a2",
		nearToPositionTo: "a27",
	});

	//Case: delta = (1|2)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("a1", "b3"), {
		nearFromPositionFrom: "a2",
		nearFromPositionTo: "a27",
		nearToPositionFrom: "b2",
		nearToPositionTo: "b23",
	});

	//Case: delta = (2|-1)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("a2", "c1"), {
		nearFromPositionFrom: "b2",
		nearFromPositionTo: "b29",
		nearToPositionFrom: "b1",
		nearToPositionTo: "b11",
	});

	//Case: delta = (-2|1)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("c1", "a2"), {
		nearFromPositionFrom: "b1",
		nearFromPositionTo: "b11",
		nearToPositionFrom: "b2",
		nearToPositionTo: "b29",
	});

	//Case: delta = (2|1)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("a1", "c2"), {
		nearFromPositionFrom: "b1",
		nearFromPositionTo: "b13",
		nearToPositionFrom: "b2",
		nearToPositionTo: "b27",
	});

	//Case: delta = (-2|1)
	assert.deepEqual(controller.calculateKnightHelperPiecePositions("c2", "a1"), {
		nearFromPositionFrom: "b2",
		nearFromPositionTo: "b27",
		nearToPositionFrom: "b1",
		nearToPositionTo: "b13",
	});
});
