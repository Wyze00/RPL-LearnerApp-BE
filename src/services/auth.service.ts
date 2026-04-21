import type { PostAuthRegister, PostAuthLogin } from "../types/auth.type.js";
import { prismaClient } from "../utils/prisma.util.js";
import { ZodUtil } from "../utils/zod.util.js";
import { AuthValidation } from "../validations/auth.validation.js";
import { BadRequestError } from "../errors/badRequest.error.js";
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
}
