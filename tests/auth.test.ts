import supertest from "supertest";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { app } from "../src/main.js";
import { TestDbUtil } from "./utils/db.util.js";

describe("POST /api/auth/register", () => {
    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    it("should register successfully with correct payload", async () => {
        const payload = {
            username: "testuser",
            password: "password123",
            email: "testuser@example.com",
            name: "Test User"
        };
        const response = await supertest(app).post("/api/auth/register").send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("success");
    });

    it("should return 400 when missing required fields", async () => {
        const payload = {
            username: "testuser"
            // Missing password, email, name
        };
        const response = await supertest(app).post("/api/auth/register").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it("should return 400 if user already exists", async () => {
        const payload = {
            username: "testuser",
            password: "password123",
            email: "testuser@example.com",
            name: "Test User"
        };
        
        // Register first time
        await supertest(app).post("/api/auth/register").send(payload);

        // Register second time
        const response = await supertest(app).post("/api/auth/register").send(payload);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});

describe("POST /api/auth/login", () => {
    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
        // pre-register a user for login testing
        const payload = {
            username: "loginuser",
            password: "password123",
            email: "loginuser@example.com",
            name: "Login User"
        };
        await supertest(app).post("/api/auth/register").send(payload);
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    it("should login successfully and return cookie", async () => {
        const payload = {
            username: "loginuser",
            password: "password123"
        };
        const response = await supertest(app).post("/api/auth/login").send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.username).toBe("loginuser");
        expect(response.body.data.roles).toContain("learner");
        
        // Assert cookie is set properly
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies![0]).toMatch(/token=/);
    });

    it("should reject login if password is wrong", async () => {
        const payload = {
            username: "loginuser",
            password: "wrongpassword"
        };
        const response = await supertest(app).post("/api/auth/login").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});

// Mock mailer util
vi.mock("../src/utils/mailer.util.js", () => {
    return {
        mailer: {
            sendMail: vi.fn().mockResolvedValue(true)
        }
    }
});

describe("POST /api/auth/forgot-password", () => {
    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
        await supertest(app).post("/api/auth/register").send({
            username: "forgotuser",
            password: "password123",
            email: "forgot@example.com",
            name: "Forgot User"
        });
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
        vi.clearAllMocks();
    });

    it("should successfully send token for existing email", async () => {
        const payload = {
            email: "forgot@example.com"
        };
        const response = await supertest(app).post("/api/auth/forgot-password").send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("success");
    });

    it("should reject and throw 400 if email not found", async () => {
        const payload = {
            email: "notfound@example.com"
        };
        const response = await supertest(app).post("/api/auth/forgot-password").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email tidak ditemukan");
    });
});

describe("POST /api/auth/forgot-password/verify", () => {
    let mockToken: string = "";

    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
        await supertest(app).post("/api/auth/register").send({
            username: "forgotuser2",
            password: "password123",
            email: "forgot2@example.com",
            name: "Forgot User 2"
        });
        
        // request reset token
        await supertest(app).post("/api/auth/forgot-password").send({ email: "forgot2@example.com" });
        
        // Pull token manually via Prisma to verify
        const { prismaClient } = await import("../src/utils/prisma.util.js");
        const user = await prismaClient.user.findFirst({ where: { email: "forgot2@example.com" } });
        mockToken = user!.passwordResetToken!;
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    it("should successfully reset password with valid token", async () => {
        const payload = {
            token: mockToken,
            password: "newpassword123"
        };
        const response = await supertest(app).post("/api/auth/forgot-password/verify").send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("success");
        
        // Assert can login with new password
        const loginResponse = await supertest(app).post("/api/auth/login").send({
            username: "forgotuser2",
            password: "newpassword123"
        });
        expect(loginResponse.status).toBe(200);
    });

    it("should throw 400 for invalid token", async () => {
        const payload = {
            token: "invalidtokenformat123",
            password: "newpassword123"
        };
        const response = await supertest(app).post("/api/auth/forgot-password/verify").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});


describe("GET /api/auth/me", () => {
    let validToken: string = "";

    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
        // pre-register and login user
        await supertest(app).post("/api/auth/register").send({
            username: "meuser",
            password: "password123",
            email: "meuser@example.com",
            name: "Me User"
        });

        const res = await supertest(app).post("/api/auth/login").send({
            username: "meuser",
            password: "password123"
        });

        validToken = (res.headers['set-cookie'] as any)[0];
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    it("should successfully retrieve user info mapped into {username, roles} on valid token", async () => {
        const response = await supertest(app)
            .get("/api/auth/me")
            .set("Cookie", validToken);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.username).toBe("meuser");
        expect(response.body.data.roles).toContain("learner");
    });

    it("should reject and throw 403 when no cookie is sent", async () => {
        const response = await supertest(app).get("/api/auth/me");

        expect(response.status).toBe(403);
    });

    it("should reject and throw whatever exception on tampered/invalid token", async () => {
        const invalidCookie = validToken.replace(/token=[^;]+/, 'token=TamperedTokenValueHere');
        
        const response = await supertest(app)
            .get("/api/auth/me")
            .set("Cookie", invalidCookie);

        expect(response.status).toBe(403); 
    });
});

describe("DELETE /api/auth/logout", () => {
    let validToken: string = "";

    beforeEach(async () => {
        await TestDbUtil.deleteUsers();
        await supertest(app).post("/api/auth/register").send({
            username: "meuser",
            password: "password123",
            email: "meuser@example.com",
            name: "Me User"
        });

        const res = await supertest(app).post("/api/auth/login").send({
            username: "meuser",
            password: "password123"
        });
        validToken = (res.headers['set-cookie'] as any)[0];
    });

    afterEach(async () => {
        await TestDbUtil.deleteUsers();
    });

    it("should throw 403 on unauthenticated logout requests", async () => {
        const response = await supertest(app)
            .delete("/api/auth/logout");

        expect(response.status).toBe(403);
    });
});

