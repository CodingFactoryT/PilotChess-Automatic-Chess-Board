import express from "express";
import fetchArduino from "../services/ArduinoCommunicator.js";

const router = express.Router();

router.post("/send-command-to-arduino", (req, res) => {
	const data = req.body;
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
