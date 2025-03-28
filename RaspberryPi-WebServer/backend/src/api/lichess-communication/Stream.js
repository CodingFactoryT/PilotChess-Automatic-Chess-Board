import axios from "axios";

let stream = null;

export async function listenStream(streamingURL, lichessAccessToken) {
	const response = await axios.get(streamingURL, {
		headers: { Authorization: `Bearer ${lichessAccessToken}` },
		responseType: "stream",
	});

	stream = response.data;
	console.log("Stream started!");

	stream.on("data", (data) => {
		console.log(data);
	});

	stream.on("error", (err) => {
		console.error("Stream error:", err);
	});
}

export function stopStream() {
	if (stream) {
		stream.destroy();
		console.log("Stream stopped!");
	}
}
