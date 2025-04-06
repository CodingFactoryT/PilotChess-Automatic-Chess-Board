import express from "express";
import LichessBoardController from "../controllers/LichessControllers/LichessBoardController.js";

const router = express.Router();

router.post("/move", (req, res) => {
	const data = req.body;
	const move = data.move;
	LichessBoardController.makeMove(move);
});

export default router;
