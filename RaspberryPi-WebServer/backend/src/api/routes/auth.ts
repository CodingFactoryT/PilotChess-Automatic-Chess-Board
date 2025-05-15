import express from "express";
import axios from "axios";
import config from "@shared/config";
import MainEventStream from "@src/controllers/Streams/MainEventStream";
import LichessTokenVault from "@src/controllers/LichessControllers/LichessTokenVault";

const router = express.Router();

router.get("/check-access-token", (req, res) => {
	const isAuthenticated = LichessTokenVault.isTokenValid();
	res.status(200).json({ authenticated: isAuthenticated });
});

router.get("/login", (req, res) => {
	try {
		MainEventStream.getInstance().listen();
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

	if (LichessTokenVault.getAccessToken()) {
		axios
			.delete(`${config.lichess_base_url}/api/token`, {
				headers: { Authorization: `Bearer ${LichessTokenVault.getAccessToken()}` },
			})
			.then(() => {
				LichessTokenVault.deleteAccessToken();
				res.status(204).send();
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send();
			});
	} else {
		res.status(204).send();
	}

	MainEventStream.getInstance().stop();
});

router.post("/set-access-token", (req, res) => {
	const token = req.accessToken;
	const expiresIn_seconds = req.body.expiresIn_seconds;
	if (!token || !expiresIn_seconds) {
		res.status(401).send();
	}
	LichessTokenVault.setAccessToken(token, expiresIn_seconds);

	res.status(204).send();
});

export default router;
