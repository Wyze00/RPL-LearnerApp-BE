import type { NextFunction, Response, Request } from "express";
import { UnauthorizeException } from "src/errors/unauthorize.error.js";
import { JwtUtil } from "src/utils/jwt.util.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token: string | undefined = req.signedCookies['token'];

    if (token === undefined) {
        throw new UnauthorizeException('Unauthorize');
    }

    await JwtUtil.verify(token);
    next();
}