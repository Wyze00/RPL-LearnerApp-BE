import type { Request, Response, Router, NextFunction } from "express";
import express from "express";
import { CourseService } from "../services/course.service.js";
import type {
  EnrollCourseRequest,
  GetCourseQuery,
  UpdateCourseRequest,
  CreateVideoRequest,
  UpdateVideoRequest,
} from "../types/course.type.js";
import type { RequestWithUsername } from "../types/express.type.js";
import { authenticationMiddleware } from "src/middlewares/authentication.middleware.js";

export class CourseRouter {
  private static router: Router;

  static {
    this.router = express.Router();
    this.init();
  }

  static init() {
    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const query = req.query as unknown as GetCourseQuery;
          const response = await CourseService.getAll(query);

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const response = await CourseService.getById(req.params.id as string);

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );
  }

  static getRouter() {
    return this.router;
  }
}

export class CourseRouterWithAuth {
  private static router: Router;

  static {
    this.router = express.Router();
    this.init();
  }

  static init() {
    this.router.use(authenticationMiddleware);
    this.router.post(
      "/:id/enroll",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const data = req.body as EnrollCourseRequest;
          const username = req.username!;
          const response = await CourseService.enroll(
            req.params.id as string,
            username,
            data,
          );

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.put(
      "/:courseId",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const data = req.body as UpdateCourseRequest;
          const username = req.username!;
          const response = await CourseService.updateCourse(
            req.params.courseId as string,
            username,
            data,
          );

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.delete(
      "/:courseId",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const username = req.username!;
          await CourseService.deleteCourse(req.params.courseId as string, username);

          return res.status(200).json({
            success: true,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.post(
      "/:courseId/videos",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const data = req.body as CreateVideoRequest;
          const username = req.username!;
          const response = await CourseService.createVideo(
            req.params.courseId as string,
            username,
            data,
          );

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.put(
      "/:courseId/videos/:videoId",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const data = req.body as UpdateVideoRequest;
          const username = req.username!;
          const response = await CourseService.updateVideo(
            req.params.courseId as string,
            req.params.videoId as string,
            username,
            data,
          );

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.delete(
      "/:courseId/videos/:videoId",
      async (req: RequestWithUsername, res: Response, next: NextFunction) => {
        try {
          const username = req.username!;
          const response = await CourseService.deleteVideo(
            req.params.courseId as string,
            req.params.videoId as string,
            username,
          );

          return res.status(200).json({
            data: response,
          });
        } catch (e) {
          next(e);
        }
      },
    );
  }

  static getRouter() {
    return this.router;
  }
}
