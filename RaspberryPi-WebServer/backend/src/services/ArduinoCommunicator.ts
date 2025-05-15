import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import config from "@shared/config";
import { ArduinoFetchQueue } from "@src/helpers/ArduinoFetchQueue";

export class ArduinoCommunicator {
	static #instance = null;

	static portPath = config.arduino_com_port;
	static baudRate = 115200; //TODO move to config
	#queue = new ArduinoFetchQueue();

	constructor() {
		if (ArduinoCommunicator.#instance) {
			throw new Error("Use ArduinoCommunicator.getInstance() instead of new.");
		}

		this.port = new SerialPort({
			path: ArduinoCommunicator.portPath,
			baudRate: ArduinoCommunicator.baudRate,
		});
		this.port.on("error", (error) => {
			console.error(`Error with serial port ${ArduinoCommunicator.portPath}: ` + error);
		});
		this.port.on("open", () => {
			console.log("------------------------------------------------------------");
			console.log("Serial port opened!");
			console.log("------------------------------------------------------------");
		});
		this.lineStream = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));

		ArduinoCommunicator.#instance = this;
	}

	static getInstance() {
		if (!ArduinoCommunicator.#instance) {
			ArduinoCommunicator.#instance = new ArduinoCommunicator();
		}

		return ArduinoCommunicator.#instance;
	}

	async fetchArduino(requestString) {
		if (!this.port.isOpen) {
			return Promise.reject(`The serial port ${ArduinoCommunicator.portPath} is not open`);
		}

		if (this.getAmountOfTasksToBeFulfilled() > 20) {
			return Promise.reject("There are already 20 tasks in the queue, please wait before sending more requests to the Arduino!");
		}

		return this.#queue.enqueue(() => this.#request(requestString));
	}

	async #request(requestString) {
		return new Promise((resolve, reject) => {
			this.port.write(requestString + "\n", (error) => {
				if (error) {
					return reject("Error while sending request: " + error);
				}

				const handleData = (data) => {
					const response = data.toString().replaceAll("\n", "");

					this.lineStream.removeListener("data", handleData);
					if (response.includes("ERRO")) {
						return reject("Error from Arduino: " + response); //TODO still invalid char in http response code
					}

					resolve({ data: response });
				};

				this.lineStream.on("data", handleData);
			});
		});
	}

	isArduinoBusy() {
		return this.getAmountOfTasksToBeFulfilled() !== 0;
	}

	getAmountOfTasksToBeFulfilled() {
		return this.#queue.size();
	}
}
