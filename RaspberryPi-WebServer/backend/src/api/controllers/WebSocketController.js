import { WebSocketServer } from "ws";
import { createServer } from "http";
import { stopMainEventStream } from "../lichess-communication/Stream.js";

const PRIVATE_CONSTRUCTOR_TOKEN = "kshdfkg3hsa56kdzgfa2w4sbdfiwuqze894odzig";

export default class WebSocketController {
	constructor(token, app) {
		this.app = app;

		if (token !== PRIVATE_CONSTRUCTOR_TOKEN) {
			throw new Error("Cannot instantiate directly. Use WebSocketController.get()");
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
				stopMainEventStream();
			};
		});
	}

	static get(app) {
		if (!WebSocketController.instance) {
			WebSocketController.instance = new WebSocketController(PRIVATE_CONSTRUCTOR_TOKEN, app);
		}
		return WebSocketController.instance;
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
