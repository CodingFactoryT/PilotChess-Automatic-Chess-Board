import express from "express";
import fetchArduino from "../services/ArduinoCommunicator.js";

const router = express.Router();

router.get("/send-command-to-arduino", (req, res) => {
	const data = req.body;
	res.status(200).json({ message: "Communication to backend works!" });
});

router.post("/send-command-to-arduino", (req, res) => {
	const data = req.body;
	const type = data.type;
	const method = data.method;
	const argumentsStr = data.arguments;
	const arduinoRequestStr = `${type}:${method}:${argumentsStr}`;

	console.log("Retrieved Post request with data: " + arduinoRequestStr);

	fetchArduino(arduinoRequestStr)
		.then((response) => {
			console.log("Success: " + response.data);
			res.status(200).send();
		})
		.catch((error) => {
			console.error(`Error while posting to ${req.baseUrl}${req.url}: ${error}`);
			res.status(500).send();
		});
});

export default router;
