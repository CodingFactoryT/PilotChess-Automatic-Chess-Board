import express from "express";
import LichessGameController from "@src/controllers/LichessControllers/LichessGameController.js";
import GameStream from "@src/controllers/Streams/GameStream.js";
const router = express.Router();

router.post("/move", (req, res) => {
	const data = req.body;
	const move = data.move;
	const gameId = GameStream.getInstance().getGameId();
	LichessGameController.makeMove(gameId, move);
	res.status(200).send();
});

export default router;
