import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

function errorMiddleware(error: HttpError, request: Request, response: Response, _: NextFunction) {
	const status = error.status ? error.status : 500;
	const message = error.message;
	const errors = error.error;
	response.status(status).send({ message, error: errors });
}

export default errorMiddleware;