import express from "express";
import cors from "cors";
import config from './config.js'
import apiRouter from './routes/api.js'
import frontendRouter from './routes/frontend.js'

const app = express();

const corsOptions = {
	origin: [`http://localhost:${config.vite_dev_port}`], // Only allow frontend dev server
};

app.use(cors(corsOptions)); //for development only?
app.use(express.json());

app.use("/api", apiRouter);


//in dev mode, the vite dev server handles the frontend
//in prod mode, it is statically provided by the backend
if (config.node_env === "prod") {
	app.use("/", frontendRouter);
}

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`);
});
