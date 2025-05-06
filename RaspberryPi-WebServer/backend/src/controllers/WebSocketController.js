import { WebSocketServer } from "ws";
import { createServer } from "http";
import MainEventStream from "./Streams/MainEventStream.js";
import LichessChallengeController from "./LichessControllers/LichessChallengeController.js";
import GameStream from "./Streams/GameStream.js";
import LichessChatController from "./LichessControllers/LichessChatController.js";

export default class WebSocketController {
	static #instance = null;

	constructor(app) {
		this.app = app;

		if (WebSocketController.#instance) {
			throw new Error("Use WebSocketController.getInstance() instead of new.");
		}

		this.server = createServer(this.app);
		this.wss = new WebSocketServer({ server: this.server });
		this.clients = new Set();

		this.wss.on("connection", (ws) => {
			this.clients.add(ws);
			console.logConnectionStatus("Frontend connected to WebSocket!");

			ws.onmessage = (event) => this.#handleIncomingData(JSON.parse(event.data));

			ws.onclose = () => {
				console.logConnectionStatus("Frontend disconnected from WebSocket!");
				this.clients.delete(ws);
				MainEventStream.getInstance().stop();
			};
		});

		WebSocketController.#instance = this;
	}

	static getInstance() {
		if (!WebSocketController.#instance) {
			WebSocketController.#instance = new WebSocketController(this.app);
		}
		return WebSocketController.#instance;
	}

	static setApp(app) {
		this.app = app;
	}

	getServer() {
		return this.server;
	}

	send(data) {
		this.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}

	#handleIncomingData(message) {
		switch (message.type) {
			case "challengeAccepted":
				return LichessChallengeController.acceptChallenge(message.data.id);
			case "challengeDeclined":
				return LichessChallengeController.declineChallenge(message.data.id);
			case "chat":
				const gameId = GameStream.getInstance().getGameId();
				LichessChatController.sendMessage(gameId, message.data.message);
			default:
				return console.error(`Unknown incoming websocket message type from frontend: ${message.type}`);
		}
	}
}
