/**
 * This Controller stores the lichess access token for the current user as only one user can be logged into the board at a time
 */
export default class LichessTokenVault {
	private static accessToken : string | undefined;
	private static accessTokenExpirationDate : bigint | undefined;

	static setAccessToken(accessToken: string | undefined, expiresIn_seconds: bigint | undefined) {
		this.accessToken = accessToken;
		this.accessTokenExpirationDate = expiresIn_seconds ? BigInt(Date.now()) + expiresIn_seconds * BigInt(1000) : undefined; //expiresIn is in seconds, Date.now() is in milliseconds
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
		this.accessToken = undefined;
		this.accessTokenExpirationDate = undefined;
	}
}
