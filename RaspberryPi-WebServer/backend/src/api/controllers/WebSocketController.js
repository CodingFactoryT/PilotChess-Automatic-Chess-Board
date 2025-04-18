import { WebSocketServer } from "ws";
import { createServer } from "http";
import MainEventStream from "./MainEventStream.js";
import LichessChallengeController from "./LichessControllers/LichessChallengeController.js";

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

	#handleIncomingData(data) {
		switch (data.type) {
			case "challengeAccepted":
				return LichessChallengeController.acceptChallenge(data.data.id);
			case "challengeDeclined":
				return LichessChallengeController.declineChallenge(data.data.id);
			default:
				return console.error(`Unknown incoming websocket message type from frontend: ${data.type}`);
		}
	}
}
