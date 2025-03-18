import axios from "axios";

const api = axios.create({
	baseURL: `http://pilotchess.local/api`,
	headers: { "Content-Type": "application/json" },
});

export function apiPost(endpoint, data, config = {}) {
	return api.post(endpoint, data, config);
}
