//import config from "../../../config";  //TODO: config cannot be used here
import axios from "axios";

const api = axios.create({
	//baseURL: `http://pilotchess.local:${config.node_port}/api`,  //TODO: config cannot be used here
	baseURL: "http://pilotchess.local:80/api",
	headers: { "Content-Type": "application/json" },
});

export function apiPost(endpoint, data, config = {}) {
	return api.post(endpoint, data, config);
}
