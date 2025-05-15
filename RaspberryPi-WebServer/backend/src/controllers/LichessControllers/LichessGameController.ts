import axios from "axios";
import config from "@shared/config";
import LichessTokenVault from "./LichessTokenVault";

const gameBaseURL = `${config.lichess_base_url}/api/board/game`;

export default class LichessGameController {
	static async makeMove(gameId: string, move: string) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/move/${move}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while making the move ${move} in game with id ${gameId}: ${error}`);
		}
	}

	static async abortGame(gameId: string) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/abort`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while aborting game with id ${gameId}: ${error}`);
		}
	}

	static async resignGame(gameId: string) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/resign`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while resigning game with id ${gameId}: ${error}`);
		}
	}

	static async offerDraw(gameId: string) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while offering a draw to game with id ${gameId}: ${error}`);
		}
	}

	static async acceptDraw(gameId: string) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while accepting a draw from game with id ${gameId}: ${error}`);
		}
	}

	static async declineDraw(gameId: string) {
		try {
			await LichessGameController.#handleDrawOffer(gameId, "no");
		} catch (error) {
			console.error(`Error while declining a draw from game with id ${gameId}: ${error}`);
		}
	}

	static async createTakeback(gameId: string) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while creating a takeback for game with id ${gameId}: ${error}`);
		}
	}

	static async acceptTakeback(gameId: string) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "yes");
		} catch (error) {
			console.error(`Error while accepting takeback from game with id ${gameId}: ${error}`);
		}
	}

	static async declineTakeback(gameId: string) {
		try {
			await LichessGameController.#handleTakebackOffer(gameId, "no");
		} catch (error) {
			console.error(`Error while declining takeback from game with id ${gameId}: ${error}`);
		}
	}

	static async claimVictory(gameId: string) {
		try {
			await axios.post(`${gameBaseURL}/${gameId}/claim-victory`, {}, LichessTokenVault.getAuthorizationHeaderObject());
		} catch (error) {
			console.error(`Error while claiming victory for game with id ${gameId}: ${error}`);
		}
	}

	static async #handleDrawOffer(gameId: string, accept: "yes" | "no") {
		await axios.post(`${gameBaseURL}/${gameId}/draw/${accept}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
	}

	static async #handleTakebackOffer(gameId: string, accept: "yes" | "no") {
		await axios.post(`${gameBaseURL}/${gameId}/takeback/${accept}`, {}, LichessTokenVault.getAuthorizationHeaderObject());
	}
}
