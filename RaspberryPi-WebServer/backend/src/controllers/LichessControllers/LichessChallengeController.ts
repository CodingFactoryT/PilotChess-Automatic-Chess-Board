import axios from "axios";
import config from "@shared/config";
import LichessTokenVault from "./LichessTokenVault";

const challengeBaseURL = `${config.lichess_base_url}/api/challenge`;
export default class LichessChallengeController {
	static async acceptChallenge(challengeId) {
		try {
			await axios.post(`${challengeBaseURL}/${challengeId}/accept`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while accepting challenge with id ${challengeId}: ${error}`);
		}
	}

	static async declineChallenge(challengeId) {
		try {
			await axios.post(`${challengeBaseURL}/${challengeId}/decline`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while declining challenge with id ${challengeId}: ${error}`);
		}
	}
}
