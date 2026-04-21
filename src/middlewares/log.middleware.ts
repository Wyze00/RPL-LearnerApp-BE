import type { NextFunction, Request, Response } from "express";
import { logger } from "src/utils/winston.util.js";

export const logMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Request masuk [Url : ${req.url}] [Method : ${req.method}] [Data : ${JSON.stringify(req.body)}]`);
    next();
}