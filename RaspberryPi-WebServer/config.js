const isNodeDev = typeof process !== "undefined" && process.env.NODE_ENV === "dev";
const isViteDev = typeof import.meta.env !== "undefined" && import.meta.env.VITE_APP_ENV === "dev";
const isProdEnv = !(isNodeDev || isViteDev);

const env = isProdEnv ? "prod" : "dev";

const nodePort = isProdEnv ? 80 : 5000;
const vitePort = 5173;
const baseURL = isProdEnv ? "http://pilotchess.local" : `http://localhost`;

const config = {
	env: env,
	base_url: baseURL,
	node_port: nodePort,
	vite_port: vitePort,
};

export default config;
