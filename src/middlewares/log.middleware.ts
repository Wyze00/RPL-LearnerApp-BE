import type { NextFunction, Request, Response } from "express";
import { logger } from "src/utils/winston.util.js";

export const logRequestMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Request masuk ${req.url} ${req.path}`)
    next();
}