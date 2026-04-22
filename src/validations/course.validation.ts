import z, { type ZodType } from "zod";
import type {
  GetCourseQuery,
  EnrollCourseRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateVideoRequest,
  UpdateVideoRequest,
} from "../types/course.type.js";
import { PaymentMethod } from "prisma/generated/enums.js";

export class CourseValidation {
  static GETQUERY: ZodType<GetCourseQuery> = z.object({
    search: z.string().optional(),
    orderBy: z.string().optional(),
    skip: z.coerce.number().min(0).optional().default(0),
    take: z.coerce.number().min(1).max(100).optional().default(10),
  });

  static ENROLLREQUEST: ZodType<EnrollCourseRequest> = z.object({
    paymentMethod: z.enum(
      PaymentMethod as any,
      "Payment Method must be one of CREDIT_CARD, DEBIT_CARD, or E_WALLET"
    ),
  });

  static CREATE_COURSE_REQUEST: ZodType<CreateCourseRequest> = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    preview_video_link: z.string().url(),
    price: z.number().min(0)
  });

  static UPDATE_COURSE_REQUEST: ZodType<UpdateCourseRequest> = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    preview_video_link: z.string().url(),
    price: z.number().min(0)
  });

  static CREATE_VIDEO_REQUEST: ZodType<CreateVideoRequest> = z.object({
    title: z.string().min(1),
    link: z.string().url(),
    duration: z.number().min(0),
    order: z.number().min(0)
  });

  static UPDATE_VIDEO_REQUEST: ZodType<UpdateVideoRequest> = z.object({
    title: z.string().min(1),
    link: z.string().url(),
    duration: z.number().min(0),
    order: z.number().min(0)
  });
}
