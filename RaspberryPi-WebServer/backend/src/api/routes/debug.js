import express from "express";
console.log("Executed 0!");
import fetchArduino from "../services/ArduinoCommunicator.js";

const router = express.Router();

router.get("/send-command-to-arduino", (req, res) => {
	const data = req.body;
	res.status(200).json({ message: "Communication to backend works!" });
});

router.post("/send-command-to-arduino", (req, res) => {
	console.log("Got post 1!");
	const data = req.body;
	console.log(data);
	console.log("Got post 2!");
	fetchArduino(data)
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
