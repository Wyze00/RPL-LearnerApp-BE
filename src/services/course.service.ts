import { prismaClient } from "../utils/prisma.util.js";
import { ZodUtil } from "../utils/zod.util.js";
import { CourseValidation } from "../validations/course.validation.js";
import type {
  GetCourseQuery,
  EnrollCourseRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateVideoRequest,
  UpdateVideoRequest,
} from "../types/course.type.js";
import { NotFoundException } from "../errors/notFound.error.js";
import { BadRequestError } from "../errors/badRequest.error.js";

export class CourseService {
  //global course API
  static async getAll(query: GetCourseQuery) {
    const validatedQuery = ZodUtil.validate(query, CourseValidation.GETQUERY);

    const where: any = validatedQuery.search
      ? {
          OR: [
            { title: { contains: validatedQuery.search, mode: "insensitive" } },
            {
              description: {
                contains: validatedQuery.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    let orderByPrisma: any = [];
    if (validatedQuery.orderBy) {
      const rules = validatedQuery.orderBy.split(",");
      for (const rule of rules) {
        const [field, direction] = rule.split(":");
        if (field && (direction === "asc" || direction === "desc")) {
          if (field === "enrolledLearners") {
            orderByPrisma.push({ enrolls: { _count: direction } });
          } else if (["title", "price", "id"].includes(field)) {
            orderByPrisma.push({ [field]: direction });
          }
        }
      }
    }

    const courses = await prismaClient.course.findMany({
      where: {},
      orderBy: orderByPrisma.length > 0 ? orderByPrisma : undefined,
      skip: validatedQuery.skip as number,
      take: validatedQuery.take as number,
    });

    return courses.map((course) => this.mapCourse(course));
  }

  static async getById(id: string) {
    const course = await prismaClient.course.findUnique({
      where: { id },
      include: {
        videos: true,
      }
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course;
  }

  //learner course API

  static async enroll(
    courseId: string,
    username: string,
    request: EnrollCourseRequest,
  ) {
    const validatedRequest = ZodUtil.validate(
      request,
      CourseValidation.ENROLLREQUEST,
    );

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { learner: true },
    });

    if (!user || !user.learner) {
      throw new BadRequestError("User is not a learner");
    }

    const course = await prismaClient.course.findUnique({
      where: { id: courseId },
      include: {
        videos: true,
      }
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const existingEnrollment =
      await prismaClient.learnerCourseEnroll.findUnique({
        where: {
          learner_id_course_id: {
            learner_id: user.learner.id,
            course_id: course.id,
          },
        },
      });

    if (existingEnrollment) {
      throw new BadRequestError("Learner is already enrolled in this course");
    }

    const validLearner = user.learner;

    const transaction = await prismaClient.$transaction(async (prisma) => {
      const enrollment = await prisma.learnerCourseEnroll.create({
        data: {
          learner_id: validLearner.id,
          course_id: course.id,
        },
      });

      const manyData: { video_id: string; enroll_id: string; isCompleted: boolean; }[] = [];
      
      course.videos.map((video) => {
        manyData.push({
          video_id: video.id,
          enroll_id: enrollment.id,
          isCompleted: false,
        })
      })

      await prisma.learnerCourseVideoEnroll.createMany({
        data: manyData
      })

      await prisma.paymentHistory.create({
        data: {
          learner_id: validLearner.id,
          course_id: course.id,
          payment_method: validatedRequest.paymentMethod as any,
          amount: course.price,
          status: "SUCCESS",
        },
      });

      return enrollment;
    });

    return this.mapCourse(course);
  }

  static mapCourse(course: any) {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor_id: course.instructor_id,
      preview_video_link: course.preview_video_link,
      price: course.price,
    };
  }

  // instructor course API

  static async createCourse(username: string, request: CreateCourseRequest) {
    const validatedRequest = ZodUtil.validate(request, CourseValidation.CREATE_COURSE_REQUEST);

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const course = await prismaClient.course.create({
      data: {
        title: validatedRequest.title,
        description: validatedRequest.description,
        preview_video_link: validatedRequest.preview_video_link,
        price: validatedRequest.price,
        instructor_id: user.instructor.id,
      },
    });

    return this.mapCourse(course);
  }

  static async updateCourse(courseId: string, username: string, request: UpdateCourseRequest) {
    const validatedRequest = ZodUtil.validate(request, CourseValidation.UPDATE_COURSE_REQUEST);

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const existingCourse = await prismaClient.course.findFirst({
      where: { id: courseId, instructor_id: user.instructor.id },
    });

    if (!existingCourse) {
      throw new NotFoundException("Course not found");
    }

    const course = await prismaClient.course.update({
      where: { id: courseId },
      data: {
        title: validatedRequest.title,
        description: validatedRequest.description,
        preview_video_link: validatedRequest.preview_video_link,
        price: validatedRequest.price,
      },
    });

    return this.mapCourse(course);
  }

  static async deleteCourse(courseId: string, username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const existingCourse = await prismaClient.course.findFirst({
      where: { id: courseId, instructor_id: user.instructor.id },
    });

    if (!existingCourse) {
      throw new NotFoundException("Course not found");
    }

    await prismaClient.course.delete({
      where: { id: courseId },
    });

    return true;
  }

  static async getVideo(courseId: string, videoId: string) {
    const video = await prismaClient.video.findUnique({
      where: { id: videoId, course_id: courseId },
    });

    if (!video) {
      throw new NotFoundException("Video not found");
    }

    return video;
  }

  static async createVideo(courseId: string, username: string, request: CreateVideoRequest) {
    const validatedRequest = ZodUtil.validate(request, CourseValidation.CREATE_VIDEO_REQUEST);

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const existingCourse = await prismaClient.course.findFirst({
      where: { id: courseId, instructor_id: user.instructor.id },
    });

    if (!existingCourse) {
      throw new NotFoundException("Course not found");
    }

    const video = await prismaClient.video.create({
      data: {
        title: validatedRequest.title,
        link: validatedRequest.link,
        duration: validatedRequest.duration,
        order: validatedRequest.order,
        course_id: courseId,
      },
    });

    return this.mapVideo(video);
  }

  static async updateVideo(courseId: string, videoId: string, username: string, request: UpdateVideoRequest) {
    const validatedRequest = ZodUtil.validate(request, CourseValidation.UPDATE_VIDEO_REQUEST);

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const existingCourse = await prismaClient.course.findFirst({
      where: { id: courseId, instructor_id: user.instructor.id },
    });

    if (!existingCourse) {
      throw new NotFoundException("Course not found");
    }

    const existingVideo = await prismaClient.video.findFirst({
      where: { id: videoId, course_id: courseId },
    });

    if (!existingVideo) {
      throw new NotFoundException("Video not found");
    }

    const video = await prismaClient.video.update({
      where: { id: videoId },
      data: {
        title: validatedRequest.title,
        link: validatedRequest.link,
        duration: validatedRequest.duration,
        order: validatedRequest.order,
      },
    });

    return this.mapVideo(video);
  }

  static async deleteVideo(courseId: string, videoId: string, username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const existingCourse = await prismaClient.course.findFirst({
      where: { id: courseId, instructor_id: user.instructor.id },
    });

    if (!existingCourse) {
      throw new NotFoundException("Course not found");
    }

    const existingVideo = await prismaClient.video.findFirst({
      where: { id: videoId, course_id: courseId },
    });

    if (!existingVideo) {
      throw new NotFoundException("Video not found");
    }

    const video = await prismaClient.video.delete({
      where: { id: videoId },
    });

    return this.mapVideo(video);
  }

  static mapVideo(video: any) {
    return {
      id: video.id,
      title: video.title,
      link: video.link,
      duration: video.duration,
      order: video.order,
      course_id: video.course_id,
    };
  }
}
