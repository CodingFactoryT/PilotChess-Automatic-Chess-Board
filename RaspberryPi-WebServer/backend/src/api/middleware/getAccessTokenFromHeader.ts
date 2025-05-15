export function getAccessTokenFromHeader(req, res, next) {
	const authHeader = req.headers["authorization"];
	if (authHeader && authHeader.startsWith("Bearer ")) {
		req.accessToken = authHeader.split(" ")[1];
	} else {
		req.accessToken = null;
	}

	next();
}
