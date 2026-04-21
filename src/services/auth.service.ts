import type { PostAuthRegister } from "../types/auth.type.js";
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
                    create: true,
                }
            }
        });

        return "success";
    }
}
