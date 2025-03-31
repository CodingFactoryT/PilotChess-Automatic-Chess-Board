import express from "express";
import cors from "cors";
import config from "../../config.js";
import apiRouter from "./routes/api.js";
import frontendRouter from "./routes/frontend.js";
import cookieParser from "cookie-parser";
import { getAccessTokenFromHeaderOrCookie } from "./api/middleware/getAccessTokenFromHeaderOrCookie.js";
import "../helpers/consoleExtensions.js";
import WebSocketController from "./api/controllers/WebSocketController.js";

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

WebSocketController.get(app)
	.getServer()
	.listen(config.node_port, () => {
		console.status(`Server listening on ${config.base_url}:${config.node_port}`);
	});
