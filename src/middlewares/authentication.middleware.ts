import type { NextFunction, Response, Request } from "express";
import { UnauthorizeException } from "../errors/unauthorize.error.js";
import { JwtUtil } from "../utils/jwt.util.js";
import type { RequestWithUsername } from "../types/express.type.js";

export const authenticationMiddleware = async (req: RequestWithUsername, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = req.signedCookies['token'] || req.cookies?.['token'];

        if (!token) {
            next(new UnauthorizeException('Unauthorize'));
            return;
        }

        const decoded = await JwtUtil.verify(token) as { username: string };
        req.username = decoded.username;
        next();
    } catch (e: any) {
        next(new UnauthorizeException('Unauthorize'));
    }
}
