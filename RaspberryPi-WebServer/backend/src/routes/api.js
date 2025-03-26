import express from "express";
const router = express.Router();
import debugRouter from "../api/routes/debug.js";
import authRouter from "../api/routes/auth.js";

router.use("/debug", debugRouter);
router.use("/auth", authRouter);

export default router;
