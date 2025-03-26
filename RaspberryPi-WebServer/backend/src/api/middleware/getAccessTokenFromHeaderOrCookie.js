export function getAccessTokenFromHeaderOrCookie(req, res, next) {
	const cookieToken = req.cookies["lichess-access-token"];
	const authHeader = req.headers["authorization"];
	if (authHeader && authHeader.startsWith("Bearer ")) {
		req.accessToken = authHeader.split(" ")[1];
	} else if (cookieToken) {
		req.accessToken = cookieToken;
	} else {
		req.accessToken = null;
	}

	next();
}
