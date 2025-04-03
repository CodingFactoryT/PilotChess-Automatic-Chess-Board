import config from "../../../config";

export default class WebSocketController {
	static initConnection(messageListener) {
		this.socket = new WebSocket(`ws://${config.base_url_without_protocol}:${config.node_port}`);
		this.socket.addEventListener("message", (event) => {
			messageListener(JSON.parse(event.data));
		});
	}

	static send(data) {
		if (!this.socket) {
			console.error("WebSocketConnection not initialized yet!");
		}

		this.socket.send(JSON.stringify(data));
	}
}
