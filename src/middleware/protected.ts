import type {NextFunction, Request, Response} from "express";
import createHttpError from "http-errors";
import {config} from "../config/config.ts";
import {fromNodeHeaders} from "better-auth/node";
import {auth} from "../utils/auth.ts";

export async function protectedRoute(req: Request, res: Response, next: NextFunction) {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!session || !session.user) {
		return next(createHttpError(401, "Unauthorized"));
	}

	req.currentUser = session.user;

	return next();
}

export function adminRoute(req: Request, res: Response, next: NextFunction) {
	return protectedRoute(req, res, () => {
		if (!req.currentUser || req.currentUser.id.toString() !== config.ADMIN_ID) {
			return next(createHttpError(401, "Unauthorized"));
		}

		return next();
	});
}