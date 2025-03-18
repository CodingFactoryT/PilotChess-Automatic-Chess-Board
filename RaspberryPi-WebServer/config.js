import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const NODE_DEFAULT_PORT = 5000;
const VITE_DEFAULT_PORT = 5173;

const rootDirName = path.dirname(fileURLToPath(import.meta.url));

const result = dotenv.config({ path: path.resolve(rootDirName, ".env") });

const isProdEnv = process.env.ENV === "prod";
const env = isProdEnv ? "prod" : "dev";

const nodePort = (isProdEnv ? Number(process.env.NODE_PROD_PORT) : Number(process.env.NODE_DEV_PORT)) || NODE_DEFAULT_PORT;
const vitePort = Number(process.env.VITE_PORT) || VITE_DEFAULT_PORT;

const config = {
	root_dir: rootDirName,
	env: env,
	node_port: nodePort,
	vite_port: vitePort,
};

export default config;
