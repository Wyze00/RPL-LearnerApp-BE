import { prismaClient } from "../utils/prisma.util.js";
import { ZodUtil } from "../utils/zod.util.js";
import { InstructorValidation } from "../validations/instructor.validation.js";
import type { GetStatsQuery } from "../types/instructor.type.js";
import { NotFoundException } from "../errors/notFound.error.js";
import { BadRequestError } from "../errors/badRequest.error.js";
import { CourseService } from "./course.service.js";

export class InstructorService {
  static async getCourses(username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const courses = await prismaClient.course.findMany({
      where: { instructor_id: user.instructor.id },
      include: {
        _count: {
          select: {
            enrolls: true,
          }
        },
      }
    });

    return courses.map((course) =>{
      return {
        ...CourseService.mapCourse(course),
        count: course._count.enrolls,
      }
    });
  }

  static async getStats(username: string, query: GetStatsQuery) {
    const validatedQuery = ZodUtil.validate(query, InstructorValidation.GET_STATS_QUERY);

    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { instructor: true },
    });

    if (!user || !user.instructor) {
      throw new BadRequestError("User is not an instructor");
    }

    const year = validatedQuery.year;
    const month = validatedQuery.month;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const stats = await prismaClient.paymentHistory.findMany({
      where: {
        course: {
          instructor_id: user.instructor.id,
        },
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    return stats.map(stat => ({
      id: stat.id,
      course_id: stat.course_id,
      learner_id: stat.learner_id,
      createdAt: stat.createdAt,
      payment_method: stat.payment_method,
      amount: stat.amount,
      status: stat.status,
    }));
  }
}
