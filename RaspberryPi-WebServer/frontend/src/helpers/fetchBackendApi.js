import axios from "axios";
import config from "../../../config";

const api = axios.create({
	baseURL: `${config.base_url}:${config.node_port}/api`,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

export function apiGet(endpoint, config = {}) {
	return api.get(endpoint, config);
}

export function apiPost(endpoint, data, config = {}) {
	return api.post(endpoint, data, config);
}
