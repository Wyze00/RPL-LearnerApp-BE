import type { Request, Response, Router, NextFunction } from "express";
import express from 'express';
import { AdminService } from "../services/admin.service.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import type { RequestWithUsername } from "../types/express.type.js";
import type { PostTopUpWithdrawRequest } from "src/types/enrollment.type.js";

export class AdminRouterWithAuth {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {
        this.router.use(authenticationMiddleware);

        this.router.get('/transactions', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const response = await AdminService.getTransactions(username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.get('/users', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const response = await AdminService.getUsers(username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.post('/topup', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const data = req.body as PostTopUpWithdrawRequest;
                const response = await AdminService.topUp(username, data);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.post('/withdraw', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const data = req.body as PostTopUpWithdrawRequest;
                const response = await AdminService.withdraw(username, data);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.get('/wallet', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const response = await AdminService.getWallet(username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });
    }

    static getRouter () {
        return this.router;
    }
}
