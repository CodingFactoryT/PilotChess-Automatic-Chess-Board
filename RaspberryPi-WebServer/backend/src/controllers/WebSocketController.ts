import WebSocket, { WebSocketServer } from "ws";
import { createServer, Server } from "http";
import MainEventStream from "./Streams/MainEventStream";
import LichessChallengeController from "./LichessControllers/LichessChallengeController";
import GameStream from "./Streams/GameStream";
import LichessChatController from "./LichessControllers/LichessChatController";
import { Express } from 'express';
export default class WebSocketController {
	private static instance: WebSocketController;
	private static app: Express;
	private server: Server;
	private wss: WebSocketServer;
	private clients: Set<WebSocket>;

	constructor(app: Express) {
		WebSocketController.app = app;

		if (WebSocketController.instance) {
			throw new Error("Use WebSocketController.getInstance() instead of new.");
		}

		this.server = createServer(WebSocketController.app);
		this.wss = new WebSocketServer({ server: this.server });
		this.clients = new Set();

		this.wss.on("connection", (ws: WebSocket) => {
			this.clients.add(ws);
			console.logConnectionStatus("Frontend connected to WebSocket!");

			ws.onmessage = (event: import("ws").MessageEvent) => {void this.#handleIncomingData(JSON.parse(event.data.toString()))};

			ws.onclose = () => {
				console.logConnectionStatus("Frontend disconnected from WebSocket!");
				this.clients.delete(ws);
				MainEventStream.getInstance().stop();
			};
		});

		WebSocketController.instance = this;
	}

	static getInstance() {
		if (!WebSocketController.instance) {
			WebSocketController.instance = new WebSocketController(this.app);
		}
		return WebSocketController.instance;
	}

	static setApp(app: Express) {
		WebSocketController.app = app;
	}

	getServer() {
		return this.server;
	}

	send(data: object) {
		this.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}

	#handleIncomingData(message: any) {
		switch (message.type) {
			case "challengeAccepted":
				return LichessChallengeController.acceptChallenge(message.data.id);
			case "challengeDeclined":
				return LichessChallengeController.declineChallenge(message.data.id);
			case "chat": {
				const gameId = GameStream.getGameId();
				return LichessChatController.sendMessage(gameId, message.data.message);
			}
			default:
				return console.error(`Unknown incoming websocket message type from frontend: ${message.type}`);
		}
	}
}
