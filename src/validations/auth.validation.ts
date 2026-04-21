import z, { type ZodType } from "zod";
import type { PostAuthRegister, PostAuthLogin, PostAuthForgotPassword, PostAuthForgotPasswordVerify } from "../types/auth.type.js";

export class AuthValidation {
    static POSTREGISTER: ZodType<PostAuthRegister> = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(100),
        email: z.string().email().max(255),
        name: z.string().min(1).max(50),
    });

    static POSTLOGIN: ZodType<PostAuthLogin> = z.object({
        username: z.string().min(1),
        password: z.string().min(1)
    });

    static POSTFORGOTPASSWORD: ZodType<PostAuthForgotPassword> = z.object({
        email: z.string().email()
    });

    static POSTFORGOTPASSWORDVERIFY: ZodType<PostAuthForgotPasswordVerify> = z.object({
        token: z.string().min(1),
        password: z.string().min(6).max(100)
    });
}
