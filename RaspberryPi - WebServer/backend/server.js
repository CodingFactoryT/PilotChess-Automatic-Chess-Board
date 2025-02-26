import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const corsOptions = {
	origin: ["http://localhost:5174"], // Only allow frontend dev server
};

app.use(cors(corsOptions)); //for development only
app.use(express.json());

app.get("/api/message", (req, res) => {
	res.json({ message: "Hello from Express backend!" });
});

let PORT = process.env.DEV_PORT || 5000;

//in dev, the vite dev server handles the frontend
if (process.env.NODE_ENV === "prod") {
	PORT = process.env.PROD_PORT;
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
