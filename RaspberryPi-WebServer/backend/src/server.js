import express from "express";
import cors from "cors";
import config from "../../config.js";
import apiRouter from "./routes/api.js";
import frontendRouter from "./routes/frontend.js";
import cookieParser from "cookie-parser";
import { getAccessTokenFromHeaderOrCookie } from "./api/middleware/getAccessTokenFromHeaderOrCookie.js";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import "../helpers/consoleExtensions.js";
import { stopStream } from "./api/lichess-communication/Stream.js";

const app = express();

const corsOptions = {
	origin: [`${config.base_url}:${config.vite_port}`, `${config.base_url}:${config.node_port}`], //only for dev
	credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(getAccessTokenFromHeaderOrCookie);

app.use("/api", apiRouter);

//in dev mode, the vite dev server handles the frontend
//in prod mode, it is statically provided by the backend
if (config.env === "prod") {
	app.use("/", frontendRouter);
}

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
	console.logConnectionStatus("Frontend connected to WebSocket!");
	ws.onmessage = (event) => {
		console.log(event.data);
	};

	ws.onclose = (event) => {
		stopStream();
	};
});

server.listen(config.node_port, () => {
	console.status(`Server listening on ${config.base_url}:${config.node_port}`);
});
