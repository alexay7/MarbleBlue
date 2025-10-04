import type {NextFunction, Request, Response} from "express";
import passport from "passport";
import createHttpError from "http-errors";
import {config} from "../config/config.ts";
import {Types} from "mongoose";

export function protectedRoute(req: Request, res: Response, next: NextFunction) {
	passport.authenticate("jwt", {session: false}, function (err: unknown, user: { _id: Types.ObjectId }) {
		if (err) return next(createHttpError(401, err));
		if (!user) return next(createHttpError(401, "Unauthorized"));

		// Attach user to request object
		req.currentUser = user;

		next();
	})(req, res, next);
}

export function adminRoute(req: Request, res: Response, next: NextFunction) {
	return protectedRoute(req, res, () => {
		if (!req.currentUser || req.currentUser._id.toString() !== config.ADMIN_ID) {
			return next(createHttpError(401, "Unauthorized"));
		}

		return next();
	});
}