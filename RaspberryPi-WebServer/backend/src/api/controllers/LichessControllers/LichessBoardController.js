import axios from "axios";
import config from "../../../../../config.js";
import LichessTokenVault from "../LichessTokenVault.js";
import GameStream from "../GameStream.js";

const boardBaseURL = `${config.lichess_base_url}/api/board`;
export default class LichessChallengeController {
	static async makeMove(move) {
		const gameId = GameStream.getInstance().gameId;
		try {
			await axios.post(`${boardBaseURL}/game/${gameId}/move/${move}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while making a move: ${error}`);
		}
	}
}
