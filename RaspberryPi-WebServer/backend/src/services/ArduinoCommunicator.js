import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import config from "../../../config.js";

const portPath = config.arduino_com_port;
const baudRate = 115200; //TODO move to config

const port = new SerialPort({
	path: portPath,
	baudRate: baudRate,
});

port.on("error", (error) => {
	console.error("Error with serial port: " + error);
});

const lineStream = port.pipe(new ReadlineParser({ delimiter: "\n" }));

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

				lineStream.removeListener("data", handleData);
				if (response.includes("ERRO")) {
					isBusy = false;
					reject("Error from Arduino: " + response); //TODO still invalid char in http response code
				}

				isBusy = false;
				resolve({ data: response });
			};

			lineStream.on("data", handleData);
		});
	});
}
