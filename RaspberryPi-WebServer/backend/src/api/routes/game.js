import express from "express";
import LichessGameController from "../controllers/LichessControllers/LichessGameController.js";
import GameStream from "../controllers/GameStream.js";
const router = express.Router();

router.post("/move", (req, res) => {
	const data = req.body;
	const move = data.move;
	const gameId = GameStream.getInstance().gameId;
	LichessGameController.makeMove(gameId, move);
});

export default router;
