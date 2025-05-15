import axios from "axios";
import config from "@shared/config";
import LichessTokenVault from "./LichessTokenVault";

const userBaseURL = `${config.lichess_base_url}/api/user`;

export default class LichessUserController {
	static async fetchUserInformation(username: string) {
		try {
			const response = await axios.get(`${userBaseURL}/${username}`, LichessTokenVault.getAuthorizationHeaderObject());
			return response.data;
		} catch (error) {
			console.error(`Error while fetching information from user ${username}: ${error}`);
		}
	}

	static async fetchLoggedInUserInformation() {
		try {
			const response = await axios.get(`${config.lichess_base_url}/api/account`, LichessTokenVault.getAuthorizationHeaderObject());
			return response.data;
		} catch (error) {
			console.error(`Error fetching information from logged in user: ${error}`);
		}
	}

	static async fetchLoggedInUsername() {
		return (await this.fetchLoggedInUserInformation()).username;
	}
}
