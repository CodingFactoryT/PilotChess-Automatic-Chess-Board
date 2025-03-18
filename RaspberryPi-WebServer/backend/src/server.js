import express from "express";
import cors from "cors";
import config from "../../config.js";
import apiRouter from "./routes/api.js";
import frontendRouter from "./routes/frontend.js";

const app = express();

const corsOptions = {
	origin: "*",
	//origin: [`http://localhost:${config.vite_port}`], // Only allow frontend dev server
};

app.use(cors(corsOptions)); //for development only?
app.use(express.json());

app.options("*", (req, res) => {
	//handle preflight requests
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.sendStatus(204);
});

app.use("/api", apiRouter);

//in dev mode, the vite dev server handles the frontend
//in prod mode, it is statically provided by the backend
if (config.env === "prod") {
	app.use("/", frontendRouter);
}

app.listen(config.node_port, () => {
	console.log(`Server listening on port ${config.node_port}`);
});
