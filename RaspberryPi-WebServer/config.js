const isNodeDev = typeof process !== "undefined" && process.env.NODE_ENV === "dev";
const isViteDev = typeof import.meta.env !== "undefined" && import.meta.env.VITE_APP_ENV === "dev";
const isProdEnv = !(isNodeDev || isViteDev);

const env = isProdEnv ? "prod" : "dev";

const nodePort = isProdEnv ? 80 : 5000;
const vitePort = 5173;
const baseURLWithoutProtocol = isProdEnv ? "pilotchess.local" : "localhost";
const baseURL = `http://${baseURLWithoutProtocol}`;

const arduinoComPort = isProdEnv ? "/dev/ttyACM0" : "COM6";

const config = {
	env: env,
	base_url: baseURL,
	base_url_without_protocol: baseURLWithoutProtocol,
	node_port: nodePort,
	vite_port: vitePort,
	lichess_base_url: "https://lichess.org",
	arduino_com_port: arduinoComPort,
};

export default config;
