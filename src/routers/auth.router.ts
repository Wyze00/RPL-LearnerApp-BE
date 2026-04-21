import type { Request, Response, Router } from "express";
import express from 'express';
import { AuthService } from "../services/auth.service.js";
import type { PostAuthRegister } from "../types/auth.type.js";

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
    }

    static getRouter () {
        return this.router;
    }
}
