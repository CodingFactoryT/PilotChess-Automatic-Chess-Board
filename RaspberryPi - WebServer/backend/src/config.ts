import dotenv from "dotenv";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import NodeEnv from "./types/NodeEnvType.js";
const NODE_DEFAULT_PORT: number = 5000;
const VITE_DEFAULT_PORT: number = 5173;

const rootDirName: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: resolve(rootDirName, "..", ".env") });
const isNodeEnvProd: boolean = process.env.NODE_ENV === "prod";
const nodeEnv: NodeEnv = isNodeEnvProd ? "prod" : "dev";

dotenv.config({ path: resolve(rootDirName, ".env"), override: true });
const port: number = (isNodeEnvProd ? Number(process.env.PROD_PORT) : Number(process.env.DEV_PORT)) || NODE_DEFAULT_PORT;
const viteDevPort: number = Number(process.env.VITE_DEV_PORT) || VITE_DEFAULT_PORT;

const config = {
    root_dir: rootDirName,
    node_env: nodeEnv,
    port: port,
    vite_dev_port: viteDevPort
}

export default config;