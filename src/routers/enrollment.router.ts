import type { Request, Response, Router, NextFunction } from "express";
import express from 'express';
import { EnrollmentService } from "../services/enrollment.service.js";
import type { PutVideoEnrollmentRequest } from "../types/enrollment.type.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import type { RequestWithUsername } from "../types/express.type.js";

export class EnrollmentRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {
        this.router.use(authenticationMiddleware);

        this.router.get('/', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const response = await EnrollmentService.getAll(username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.get('/:enrollmentId', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const enrollmentId = req.params.enrollmentId as string;
                const response = await EnrollmentService.getById(enrollmentId, username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.put('/:enrollmentId/videos/:videoId', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const enrollmentId = req.params.enrollmentId as string;
                const videoId = req.params.videoId as string;
                const data = req.body as PutVideoEnrollmentRequest;

                const response = await EnrollmentService.updateVideoEnrollment(enrollmentId, videoId, username, data);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.get('/:enrollmentId/videos/:videoId', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const enrollmentId = req.params.enrollmentId as string;
                const videoId = req.params.videoId as string;

                const response = await EnrollmentService.getVideoEnrollment(enrollmentId, videoId);
                
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
