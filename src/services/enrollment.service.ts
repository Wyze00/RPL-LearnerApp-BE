import type { LearnerCourseEnroll, LearnerCourseVideoEnroll } from "prisma/generated/client.js";
import type { PutVideoEnrollmentRequest } from "../types/enrollment.type.js";
import { prismaClient } from "../utils/prisma.util.js";
import { ZodUtil } from "../utils/zod.util.js";
import { EnrollmentValidation } from "../validations/enrollment.validation.js";
import { NotFoundException } from "../errors/notFound.error.js";

export class EnrollmentService {
    static async getAll(username: string) {
        const user = await prismaClient.user.findUnique({
            where: { username },
            include: { learner: true }
        });

        if (!user || !user.learner) {
            throw new NotFoundException('Learner not found');
        }

        const enrollments = await prismaClient.learnerCourseEnroll.findMany({
            where: { learner_id: user.learner.id },
            include: {
                course: true,
                LearnerCourseVideoEnrolls: true
            }
        });

        return enrollments.map((enrollment) => {
            const progress = Math.round(enrollment.LearnerCourseVideoEnrolls.filter((v) => v.isCompleted).length / enrollment.LearnerCourseVideoEnrolls.length * 100);
            console.log(enrollment.LearnerCourseVideoEnrolls);
            return {
                ...this.mapEnrollment(enrollment),
                course: enrollment.course,
                progress: progress,
            }
        });
    }

    static async getById(enrollmentId: string, username: string) {
        const user = await prismaClient.user.findUnique({
            where: { username },
            include: { learner: true }
        });

        if (!user || !user.learner) {
            throw new NotFoundException('Learner not found');
        }

        const enrollment = await prismaClient.learnerCourseEnroll.findFirst({
            where: { 
                id: enrollmentId,
                learner_id: user.learner.id 
            },
            include: {
                course: true,
                LearnerCourseVideoEnrolls: {
                    include: {
                        video: true,
                    }
                }
            }
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        const progress = Math.round(enrollment.LearnerCourseVideoEnrolls.filter((v) => v.isCompleted).length / enrollment.LearnerCourseVideoEnrolls.length * 100);
        return {
            ...this.mapEnrollment(enrollment),
            course: enrollment.course,
            progress: progress,
            enrollmentVideos: enrollment.LearnerCourseVideoEnrolls,
        }
    }

    static async getVideoEnrollment(enrollmentId: string, videoId: string) {
        const videoEnrollment = await prismaClient.learnerCourseVideoEnroll.findFirst({
            where: {
                enroll_id: enrollmentId,
                id: videoId
            },
            include: {
                video: true,
            }
        });

        return videoEnrollment;
    }

    static async updateVideoEnrollment(enrollmentId: string, videoId: string, username: string, request: PutVideoEnrollmentRequest) {
        const validatedData = ZodUtil.validate(request, EnrollmentValidation.PUT_VIDEO_ENROLLMENT_REQUEST);
        
        const user = await prismaClient.user.findUnique({
            where: { username },
            include: { learner: true }
        });

        if (!user || !user.learner) {
            throw new NotFoundException('Learner not found');
        }

        const enrollment = await prismaClient.learnerCourseEnroll.findFirst({
            where: {
                id: enrollmentId,
                learner_id: user.learner.id
            }
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        const videoEnrollment = await prismaClient.learnerCourseVideoEnroll.findFirst({
            where: {
                enroll_id: enrollmentId,
                id: videoId
            }
        });

        if (!videoEnrollment) {
            throw new NotFoundException('Video enrollment not found');
        }

        const updatedVideoEnrollment = await prismaClient.learnerCourseVideoEnroll.update({
            where: { id: videoEnrollment.id },
            data: { isCompleted: validatedData.isCompleted }
        });

        return this.mapVideoEnrollment(updatedVideoEnrollment);
    }

    static mapEnrollment(enrollment: LearnerCourseEnroll) {
        return {
            id: enrollment.id,
            learner_id: enrollment.learner_id,
            course_id: enrollment.course_id
        };
    }

    static mapVideoEnrollment(videoEnrollment: LearnerCourseVideoEnroll) {
        return {
            id: videoEnrollment.id,
            enroll_id: videoEnrollment.enroll_id,
            video_id: videoEnrollment.video_id,
            isCompleted: videoEnrollment.isCompleted
        };
    }
}
