import type { Request, Response, Router, NextFunction } from "express";
import express from 'express';
import { InstructorService } from "../services/instructor.service.js";
import { CourseService } from "../services/course.service.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import type { RequestWithUsername } from "../types/express.type.js";
import type { GetStatsQuery } from "../types/instructor.type.js";
import type { CreateCourseRequest } from "../types/course.type.js";

export class InstructorRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {
        this.router.use(authenticationMiddleware);

        this.router.get('/courses', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const username = req.username!;
                const response = await InstructorService.getCourses(username);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.post('/courses', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const data = req.body as CreateCourseRequest;
                const username = req.username!;
                const response = await CourseService.createCourse(username, data);

                return res.status(200).json({
                    data: response,
                });
            } catch (e) {
                next(e);
            }
        });

        this.router.get('/stats', async (req: RequestWithUsername, res: Response, next: NextFunction) => {
            try {
                const query = req.query as unknown as GetStatsQuery;
                const username = req.username!;
                const response = await InstructorService.getStats(username, query);

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
