import supertest from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
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
