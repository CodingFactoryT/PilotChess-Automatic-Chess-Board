const isNodeDev = typeof process !== "undefined" && process.env.NODE_ENV === "dev";
const isViteDev = typeof import.meta.env !== "undefined" && import.meta.env.VITE_APP_ENV === "dev";
const isProdEnv = !(isNodeDev || isViteDev);

const env = isProdEnv ? "prod" : "dev";

const nodePort = isProdEnv ? 80 : 5000;
const vitePort = 5173;

//only works when config is accessed via node.js
let isRaspberryPi = false;
if (typeof process !== "undefined") {
	// Only import 'os' in Node
	const os = await import("os");
	const platform = os.platform();
	const cpu = os.cpus()[0]?.model?.toLowerCase() || "";
	isRaspberryPi = platform === "linux" && cpu.includes("cortex");
	console.log(isRaspberryPi);
	console.log(platform);
	console.log(cpu);
}

const baseURLWithoutProtocol = isProdEnv || isRaspberryPi ? "pilotchess.local" : "localhost";
const baseURL = `http://${baseURLWithoutProtocol}`;

const arduinoComPort = isRaspberryPi ? "/dev/ttyACM0" : "COM6";

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
