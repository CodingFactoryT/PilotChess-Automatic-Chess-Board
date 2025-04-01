import axios from "axios";
import { handleIncomingData as handleIncomingMainEventStreamData } from "../controllers/MainEventStreamController.js";
import { handleIncomingData as handleIncomingGameStreamData } from "../controllers/GameStreamController.js";
import config from "../../../../config.js";

const MAIN_EVENT_STREAM_NAME = "MainEventStream";
const GAME_STREAM_NAME = "GameStream";

const streams = {
	[MAIN_EVENT_STREAM_NAME]: { name: MAIN_EVENT_STREAM_NAME, stream: null, handleStreamData: handleIncomingMainEventStreamData },
	[GAME_STREAM_NAME]: { name: GAME_STREAM_NAME, stream: null, handleStreamData: handleIncomingGameStreamData },
};

export async function listenMainEventStream(lichessAccessToken) {
	listenStream(`${config.lichess_base_url}/api/stream/event`, lichessAccessToken, MAIN_EVENT_STREAM_NAME);
}

export async function listenGameStream(gameId, lichessAccessToken) {
	listenStream(`${config.lichess_base_url}/api/stream/game/${gameId}`, lichessAccessToken, GAME_STREAM_NAME);
}

export function stopMainEventStream() {
	stopStream(MAIN_EVENT_STREAM_NAME);
}

export function stopGameStream() {
	stopStream(GAME_STREAM_NAME);
}

export async function listenStream(streamingURL, lichessAccessToken, streamName) {
	try {
		const streamObj = streams[streamName];

		const response = await axios.get(streamingURL, {
			headers: { Authorization: `Bearer ${lichessAccessToken}` },
			responseType: "stream",
		});

		streamObj.stream = response.data;
		console.logConnectionStatus(`${streamName}-Stream started!`);

		streamObj.stream.on("data", (data) => {
			//if the data is not the empty keep-alive request that is sent every few seconds
			data = data.toString().trim();
			if (data.length > 0) {
				streamObj.handleStreamData(JSON.parse(data));
			}
		});

		streamObj.stream.on("error", (error) => {
			console.error(`${streamName}-Stream error: ${error}`);
		});
	} catch (error) {
		console.error(`Error while trying to listen to ${streamName}-Stream: ${error}`);
	}
}

function stopStream(streamName) {
	const streamObj = streams[streamName];
	if (streamObj.stream) {
		streamObj.stream.destroy();
		streamObj.stream = null;
		console.logConnectionStatus(`${streamName}-Stream stopped!`);
	}
}
