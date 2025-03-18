import express from "express";
import cors from "cors";
import config from "../../config.js";
import apiRouter from "./routes/api.js";
import frontendRouter from "./routes/frontend.js";

const app = express();

const corsOptions = {
	origin: [`${config.base_url}:${config.vite_port}`, `${config.base_url}:${config.node_port}`], //only for dev
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
	console.log(`Server listening on ${config.base_url}:${config.node_port}`);
});
