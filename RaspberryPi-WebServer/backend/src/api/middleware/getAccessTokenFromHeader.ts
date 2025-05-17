import { Request, Response, NextFunction } from "express";

export function getAccessTokenFromHeader(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	if (authHeader && authHeader.startsWith("Bearer ")) {
		req.accessToken = authHeader.split(" ")[1];
	} else {
		req.accessToken = undefined;
	}

	next();
}
