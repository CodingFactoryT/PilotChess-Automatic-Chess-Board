import express from "express";
const router = express.Router();
import debugRouter from "../api/routes/debug.js";

router.get("/", (req, res) => {
	res.status(200).json({ message: "Hello from Express backend!" });
});

router.use("/debug", debugRouter);

export default router;
