import type { Request, Response, Router } from "express";
import express from 'express';
import { AuthService } from "../services/auth.service.js";
import type { PostAuthRegister, PostAuthLogin } from "../types/auth.type.js";
import { JwtUtil } from "../utils/jwt.util.js";

export class AuthRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {
        this.router.post('/register', async (req: Request, res: Response) => {
            const data = req.body as PostAuthRegister;
            const response = await AuthService.register(data);

            res.status(200).json({
                data: response,
            });
        })

        this.router.post('/login', async (req: Request, res: Response) => {
            const data = req.body as PostAuthLogin;
            const response = await AuthService.login(data);

            const token = await JwtUtil.sign({ username: response.username });

            res.cookie('token', token, {
                signed: true,
                httpOnly: true,
            });

            res.status(200).json({
                data: response,
            });
        });
    }

    static getRouter () {
        return this.router;
    }
}
