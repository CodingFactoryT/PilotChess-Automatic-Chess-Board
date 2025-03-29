import axios from "axios";
import { handleIncomingData } from "../controllers/UserStreamController.js";

let stream = null;

export async function listenStream(streamingURL, lichessAccessToken) {
	const response = await axios.get(streamingURL, {
		headers: { Authorization: `Bearer ${lichessAccessToken}` },
		responseType: "stream",
	});

	stream = response.data;
	console.logConnectionStatus("Stream started!");

	stream.on("data", (data) => {
		//if the data is not the keep-alive empty request that is sent every few seconds
		if (data.length > 1) {
			handleIncomingData(JSON.parse(data));
		}
	});

	stream.on("error", (err) => {
		console.error("Stream error:", err);
	});
}

export function stopStream() {
	if (stream) {
		stream.destroy();
		stream = null;
		console.logConnectionStatus("Stream stopped!");
	}
}
