const isProdEnv = process.env.ENV === "prod";
const env = isProdEnv ? "prod" : "dev";

const nodePort = isProdEnv ? 80 : 5000;
const vitePort = 5173;

const config = {
	env: env,
	node_port: nodePort,
	vite_port: vitePort,
};

export default config;
