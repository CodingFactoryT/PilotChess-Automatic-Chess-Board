import express from "express";
import path from "path";

const router = express.Router();
const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

router.use(express.static(path.join(rootDirectory, "frontend/dist")));

router.get("*", (req, res) => {
	res.sendFile(path.join(rootDirectory, "frontend/dist/index.html"));
});

export default router;
