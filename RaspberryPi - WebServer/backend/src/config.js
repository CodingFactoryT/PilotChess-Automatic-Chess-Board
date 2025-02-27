import dotenv from "dotenv";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
const NODE_DEFAULT_PORT = 5000;
const VITE_DEFAULT_PORT = 5173;

const rootDirName = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: resolve(rootDirName, "..", ".env") });
const isNodeEnvProd = process.env.NODE_ENV === "prod";
const nodeEnv = isNodeEnvProd ? "prod" : "dev";

dotenv.config({ path: resolve(rootDirName, ".env"), override: true });
const port = (isNodeEnvProd ? process.env.PROD_PORT : process.env.DEV_PORT) || NODE_DEFAULT_PORT;
const viteDevPort = process.env.VITE_DEV_PORT || VITE_DEFAULT_PORT;

const config = {
	root_dir: rootDirName,
	node_env: nodeEnv,
	port: port,
	vite_dev_port: viteDevPort,
};

export default config;
