import express from "express";
const router = express.Router();
import debugRouter from "@src/api/routes/debug";
import authRouter from "@src/api/routes/auth";
import gameRouter from "@src/api/routes/game";

router.use("/debug", debugRouter);
router.use("/auth", authRouter);
router.use("/game", gameRouter);

export default router;
