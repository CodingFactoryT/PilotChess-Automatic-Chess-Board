import express from "express";
import path from "path";
import config from "../../../config.js";

const router = express.Router();

router.use(express.static(path.join(config.root_dir, "frontend/dist")));

router.get("*", (req, res) => {
	res.sendFile(path.join(config.root_dir, "frontend/dist/index.html"));
});

export default router;
