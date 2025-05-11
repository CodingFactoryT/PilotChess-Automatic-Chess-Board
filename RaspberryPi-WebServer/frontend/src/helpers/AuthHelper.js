import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";
import CryptoJS from "crypto-js";
import axios from "axios";
import config from "@shared/config.js";

export function requestAuthorizationCode(clientId, redirectURI, scope) {
	const LENGTH = 32;
	const { code_verifier, code_challenge } = generatePKCEPair(LENGTH);
	const state = generateRandomString(LENGTH);

	sessionStorage.setItem("code_verifier", code_verifier);
	sessionStorage.setItem("state", state);

	const authURL = new URL(`${config.lichess_base_url}/oauth`);
	authURL.searchParams.set("response_type", "code");
	authURL.searchParams.set("client_id", clientId);
	authURL.searchParams.set("redirect_uri", redirectURI);
	authURL.searchParams.set("code_challenge_method", "S256");
	authURL.searchParams.set("code_challenge", code_challenge);
	authURL.searchParams.set("scope", scope);
	authURL.searchParams.set("state", state);

	window.location.href = authURL.toString();
}

export async function obtainAccessToken(lichessURL, code, codeVerifier, redirectURL, clientId) {
	const formData = new URLSearchParams();
	formData.append("grant_type", "authorization_code");
	formData.append("code", code);
	formData.append("code_verifier", codeVerifier);
	formData.append("redirect_uri", redirectURL);
	formData.append("client_id", clientId);

	try {
		const response = await axios.post(`${lichessURL}/api/token`, formData.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const data = response.data;

		return { access_token: data.access_token, expires_in: data.expires_in };
	} catch (error) {
		console.error(error);
	}
}

function generatePKCEPair(length) {
	const randomVerifier = generateRandomString(length);
	const hash = Base64.stringify(sha256(randomVerifier));
	const challenge = hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Clean base64 to make it URL safe
	return { code_verifier: randomVerifier, code_challenge: challenge };
}

function generateRandomString(length) {
	return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
}
