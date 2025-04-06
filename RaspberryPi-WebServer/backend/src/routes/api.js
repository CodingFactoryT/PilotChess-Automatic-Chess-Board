import express from "express";
const router = express.Router();
import debugRouter from "../api/routes/debug.js";
import authRouter from "../api/routes/auth.js";
import gameRouter from "../api/routes/game.js";

router.use("/debug", debugRouter);
router.use("/auth", authRouter);
router.use("/game", gameRouter);

export default router;
