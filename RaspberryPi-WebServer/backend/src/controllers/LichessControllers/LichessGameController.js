import axios from "axios";
import config from "../../../../config.js";
import LichessTokenVault from "./LichessTokenVault.js";

const gameBaseURL = `${config.lichess_base_url}/api/board/game`;

export default class LichessGameController {
	static async makeMove(gameId, move) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/move/${move}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while making the move ${move} in game with id ${gameId}: ${error}`);
		}
	}

	static async abortGame(gameId) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/abort`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while aborting game with id ${gameId}: ${error}`);
		}
	}

	static async resignGame(gameId) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/resign`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while resigning game with id ${gameId}: ${error}`);
		}
	}

	static async offerDraw(gameId) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while offering a draw to game with id ${gameId}: ${error}`);
		}
	}

	static async acceptDraw(gameId) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while accepting a draw from game with id ${gameId}: ${error}`);
		}
	}

	static async declineDraw(gameId) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "no");
		} catch (error) {
			console.error(`Error while declining a draw from game with id ${gameId}: ${error}`);
		}
	}

	static async createTakeback(gameId) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while creating a takeback for game with id ${gameId}: ${error}`);
		}
	}

	static async acceptTakeback(gameId) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while accepting takeback from game with id ${gameId}: ${error}`);
		}
	}

	static async declineTakeback(gameId) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "no");
		} catch (error) {
			console.error(`Error while declining takeback from game with id ${gameId}: ${error}`);
		}
	}

	static async claimVictory(gameId) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/claim-victory`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while claiming victory for game with id ${gameId}: ${error}`);
		}
	}

	static async #handleDrawOffer(gameId, accept) {
		await axios.post(`${gameBaseURL}/${gameId}/draw/${accept}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
	}

	static async #handleTakebackOffer(gameId, accept) {
		await axios.post(`${gameBaseURL}/${gameId}/takeback/${accept}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
	}
}
