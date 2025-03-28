import express from "express";
import axios from "axios";
import config from "../../../../config.js";
import { listenStream, stopStream } from "../lichess-communication/Stream.js";

const router = express.Router();

router.get("/check-access-token", (req, res) => {
	if (req.accessToken) {
		res.status(204).send();
	} else {
		res.status(401).send();
	}
});

router.get("/login", (req, res) => {
	try {
		listenStream(`${config.lichess_base_url}/api/stream/event`, req.accessToken);
		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
});

router.get("/logout", (req, res) => {
	res.clearCookie("lichess-access-token", {
		httpOnly: true,
		sameSite: "Strict",
	});

	if (req.accessToken) {
		axios
			.delete(`${config.lichess_base_url}/api/token`, {
				headers: { Authorization: `Bearer ${req.accessToken}` },
			})
			.then((response) => {
				res.status(204).send();
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send();
			});
	} else {
		res.status(204).send();
	}

	stopStream();
});

router.post("/set-access-token-cookie", (req, res) => {
	const token = req.accessToken;
	const expiresIn_seconds = req.body.expiresIn_seconds;
	if (!token || !expiresIn_seconds) {
		res.status(401).send();
	}

	res.cookie("lichess-access-token", token, {
		//raspberry pi uses http instead of https, thats why secure is not set
		httpOnly: true,
		maxAge: expiresIn_seconds * 1000,
		sameSite: "Strict",
	});

	res.status(204).send();
});

export default router;
