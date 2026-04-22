import z, { type ZodType } from "zod";
import type { PutVideoEnrollmentRequest } from "../types/enrollment.type.js";

export class EnrollmentValidation {
  static PUT_VIDEO_ENROLLMENT_REQUEST: ZodType<PutVideoEnrollmentRequest> =
    z.object({
      isCompleted: z.boolean(),
    });
}
