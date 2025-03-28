import { SerialPort } from "serialport";

const portPath = "/dev/ttyACM0"; //TODO move to config
const baudRate = 115200; //TODO move to config

const port = new SerialPort({
	path: portPath,
	baudRate: baudRate,
});

port.on("error", (error) => {
	console.error("Error with serial port: " + error);
});

let isBusy = false;

export default function fetchArduino(requestString) {
	if (!port.isOpen) {
		return Promise.reject("The serial port is not open");
	}

	if (isBusy) {
		return Promise.reject("Arduino is busy");
	}

	isBusy = true;

	return new Promise((resolve, reject) => {
		port.write(requestString + "\n", (error) => {
			if (error) {
				isBusy = false;
				reject("Error while sending request: " + error);
			}

			const handleData = (data) => {
				const response = data.toString().replaceAll("\n", "");
				port.removeListener("data", handleData);
				if (response.includes("ERRO")) {
					isBusy = false;
					reject("Error from Arduino: " + response); //TODO still invalid char in http response code
				}

				isBusy = false;
				resolve(response);
			};

			port.on("data", handleData);
		});
	});
}
