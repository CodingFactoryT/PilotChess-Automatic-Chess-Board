import { WebSocketServer } from "ws";
import { createServer } from "http";
import MainEventStream from "./MainEventStream.js";

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

			ws.onmessage = (event) => this.#handleIncomingData(event);

			ws.onclose = () => {
				console.logConnectionStatus("Frontend disconnected from WebSocket!");
				this.clients.delete(ws);
				MainEventStream.getInstance().stop();
			};
		});

		WebSocketController.#instance = this;
	}

	static getInstance(app) {
		if (!WebSocketController.#instance) {
			WebSocketController.#instance = new WebSocketController(app);
		}
		return WebSocketController.#instance;
	}

	getServer() {
		return this.server;
	}

	send(data) {
		this.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}

	#handleIncomingData(event) {
		console.log(event.data);
	}
}
