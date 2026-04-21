import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "src/errors/http.error.js";
import { logger } from "src/utils/winston.util.js";
import { ZodError } from "zod";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {

    logger.error(`Error ${req.url}`);

    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            error: err.message,
        })
    }

    if (err instanceof HttpException) {
        return res.status(err.status).json({
            error: err.message,
        })
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: err.issues.map((val) => val.message).toString(),
        })
    }

    if (err instanceof Error) {
        return res.status(500).json({
            error: err.message,
        })
    }

    return res.status(500).json({
        error: 'any error'
    })
}