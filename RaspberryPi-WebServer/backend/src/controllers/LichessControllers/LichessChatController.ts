import axios from "axios";
import config from "@shared/config";
import LichessTokenVault from "./LichessTokenVault";

const gameBaseURL = `${config.lichess_base_url}/api/board/game`;

export default class LichessChatController {
	static async sendMessage(gameId, message) {
		try {
			await axios.post(
				`${gameBaseURL}/${gameId}/chat`,
				{
					room: "player",
					text: message,
				},
				LichessTokenVault.getAuthorizationHeaderObject()
			);
		} catch (error) {
			console.error(`Error while sending message "${message}" to game with id ${gameId}: ${error}`);
		}
	}

	static async fetchChat(gameId) {
		try {
			const response = await axios.get(`${gameBaseURL}/${gameId}/chat`, LichessTokenVault.getAuthorizationHeaderObject());
			return response.data;
		} catch (error) {
			console.error(`Error while fetching chat from game with id ${gameId}: ${error}`);
		}
	}
}
