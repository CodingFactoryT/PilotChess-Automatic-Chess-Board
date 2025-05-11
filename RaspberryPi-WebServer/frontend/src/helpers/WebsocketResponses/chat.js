import WebSocketController from "@src/controller/WebSocketController.js";

export function sendChatMessage(message) {
	WebSocketController.send({
		type: "chat",
		data: {
			message: message,
		},
	});
}
