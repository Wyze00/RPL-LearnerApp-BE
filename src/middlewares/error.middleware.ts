import type { NextFunction, Request, Response } from "express";
import { HttpException } from "src/errors/http.error.js";
import { logger } from "src/utils/winston.util.js";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {

    logger.error(`Error ${req.url}`);

    if (err instanceof HttpException) {
        return res.status(err.status).json({
            err: err.message,
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