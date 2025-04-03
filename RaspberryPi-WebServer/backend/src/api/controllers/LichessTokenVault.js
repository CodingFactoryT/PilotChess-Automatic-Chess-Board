/**
 * This Controller stores the lichess access token for the current user as only one user can be logged into the board at a time
 */
export default class LichessTokenVault {
	static setAccessToken(accessToken, expiresIn_seconds) {
		this.accessToken = accessToken;
		this.accessTokenExpirationDate = Date.now() + expiresIn_seconds * 1000; //expiresIn is in seconds, Date.now() is in milliseconds
	}

	static getAccessToken() {
		if (!this.isTokenValid) {
			this.deleteAccessToken();
			return null;
		}

		return this.accessToken;
	}

	static #isAccessTokenExpired() {
		return this.accessTokenExpirationDate && Date.now() > this.accessTokenExpirationDate;
	}

	static isTokenValid() {
		return this.accessToken && !this.#isAccessTokenExpired();
	}

	static getAuthorizationHeaderObject() {
		return { headers: { Authorization: `Bearer ${LichessTokenVault.getAccessToken()}` } };
	}

	static deleteAccessToken() {
		this.accessToken = null;
		this.accessTokenExpirationDate = null;
	}
}
