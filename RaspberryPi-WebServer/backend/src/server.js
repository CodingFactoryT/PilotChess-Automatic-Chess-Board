import express from "express";
import cors from "cors";
import config from "../../config.js";
import apiRouter from "./routes/api.js";
import frontendRouter from "./routes/frontend.js";

const app = express();

const corsOptions = {
	origin: config.env === "prod" ? "http://pilotchess.local" : [`http://http://pilotchess.local:${config.vite_port}`, `http://http://pilotchess.local:${config.node_port}`],
	methods: "GET, POST, PUT, DELETE, OPTIONS",
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", apiRouter);

//in dev mode, the vite dev server handles the frontend
//in prod mode, it is statically provided by the backend
if (config.env === "prod") {
	app.use("/", frontendRouter);
}

app.listen(config.node_port, () => {
	console.log(`Server listening on port ${config.node_port}`);
});
