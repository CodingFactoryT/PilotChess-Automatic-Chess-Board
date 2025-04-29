export function sendChatMessage(message) {
	WebSocketController.send({
		type: "chat",
		data: {
			message: message,
		},
	});
}
