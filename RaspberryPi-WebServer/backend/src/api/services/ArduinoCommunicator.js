import { SerialPort } from "serialport";

const portPath = "/dev/ttyACM0"; //TODO move to config
const baudRate = 115200; //TODO move to config

const port = new SerialPort({
	path: portPath,
	baudRate: baudRate,
});

port.open((error) => {
	if (error) {
		console.error("Error while opening serial port: " + error);
	}
});

port.on("error", (error) => {
	console.error("Error with serial port: " + error);
});

let isBusy = false;

export default function fetchArduino(requestString) {
	console.log("Fetching Arduino!");
	if (!port.isOpen) {
		return Promise.reject("The serial port is not open");
	}
	console.log("Fetching Arduino 2!");

	if (isBusy) {
		return Promise.reject("Arduino is busy");
	}
	console.log("Fetching Arduino 3!");

	isBusy = true;

	return new Promise((resolve, reject) => {
		console.log("Fetching Arduino 4!");
		port.write(requestString + "\n", (error) => {
			console.log("Fetching Arduino 5!");
			if (error) {
				isBusy = false;
				reject("Error while sending request: " + error.message);
			}
			console.log("Fetching Arduino 6!");
			const handleData = (data) => {
				const response = data.toString();
				port.removeListener("data", handleData);
				console.log("Fetching Arduino 7!");
				if (response.includes("ERRO")) {
					isBusy = false;
					console.log("Fetching Arduino 8!");
					reject("Error from Arduino: " + response);
				}
				console.log("Fetching Arduino 9!");

				isBusy = false;
				resolve(response);
			};

			console.log("Fetching Arduino 10!");
			port.on("data", handleData);
		});
	});
}
