import { ArduinoCommunicator } from "@src/services/ArduinoCommunicator";
import express from "express";

const router = express.Router();

router.post("/send-command-to-arduino", (req, res) => {
	const data = req.body;
	const type = data.type;
	const method = data.method;
	const argumentsStr = data.arguments;
	const arduinoRequestStr = `${type}:${method}:${argumentsStr}`;

	ArduinoCommunicator.getInstance()
		.fetchArduino(arduinoRequestStr)
		.then((response) => {
			console.log("Success: " + response);
			res.status(200).send();
		})
		.catch((error) => {
			console.error(`Error while posting to ${req.baseUrl}${req.url}: ${error}`);
			res.statusMessage = error;
			res.status(500).send();
		});
});

export default router;
