import type { PostAuthRegister, PostAuthLogin, PostAuthForgotPassword, PostAuthForgotPasswordVerify } from "../types/auth.type.js";
import { prismaClient } from "../utils/prisma.util.js";
import { ZodUtil } from "../utils/zod.util.js";
import { AuthValidation } from "../validations/auth.validation.js";
import { BadRequestError } from "../errors/badRequest.error.js";
import { UuidUtil } from "../utils/uuid.util.js";
import { mailer } from "../utils/mailer.util.js";
import { BcryptUtil } from "../utils/bcrypt.util.js";
import bcrypt from "bcrypt";

export class AuthService {
    static async register(data: PostAuthRegister) {
        const validatedData = ZodUtil.validate(data, AuthValidation.POSTREGISTER);

        const existingUser = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email }
                ]
            }
        });

        if (existingUser) {
            throw new BadRequestError("Username or email already exists");
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        await prismaClient.user.create({
            data: {
                username: validatedData.username,
                password: hashedPassword,
                email: validatedData.email,
                name: validatedData.name,
                learner: {
                    create: {},
                }
            }
        });

        return "success";
    }

    static async login(data: PostAuthLogin) {
        const validatedData = ZodUtil.validate(data, AuthValidation.POSTLOGIN);

        const user = await prismaClient.user.findUnique({
            where: { username: validatedData.username },
            include: {
                admin: true,
                learner: true,
                instructor: true,
            }
        });

        if (!user) {
            throw new BadRequestError("Username atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError("Username atau password salah");
        }

        const roles: string[] = [];
        if (user.admin) roles.push("admin");
        if (user.learner) roles.push("learner");
        if (user.instructor) roles.push("instructor");

        if (roles.length === 0) {
            roles.push("user");
        }

        return {
            username: user.username,
            roles: roles,
        };
    }

    static async forgotPassword(data: PostAuthForgotPassword) {
        const validatedData = ZodUtil.validate(data, AuthValidation.POSTFORGOTPASSWORD);
        
        const user = await prismaClient.user.findUnique({
            where: { email: validatedData.email }
        });

        if (!user) {
            throw new BadRequestError("Email tidak ditemukan");
        }

        const token = UuidUtil.generate();
        const expired = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prismaClient.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetExpired: expired
            }
        });

        await mailer.sendMail({
            to: validatedData.email,
            subject: "Reset Password",
            text: `Klik link berikut untuk reset password: http://localhost:5173/forgot-password?token=${token}`
        });

        return "success";
    }

    static async forgotPasswordVerify(data: PostAuthForgotPasswordVerify) {
        const validatedData = ZodUtil.validate(data, AuthValidation.POSTFORGOTPASSWORDVERIFY);

        const user = await prismaClient.user.findFirst({
            where: {
                passwordResetToken: validatedData.token,
                passwordResetExpired: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            throw new BadRequestError("Token tidak valid atau sudah kedaluwarsa");
        }

        const hashedPassword = await BcryptUtil.hash(validatedData.password);

        await prismaClient.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpired: null
            }
        });

        return "success";
    }
}
