import { prismaClient } from "../../src/utils/prisma.util.js";

export class TestDbUtil {
    static async deleteUsers() {
        await prismaClient.user.deleteMany({
            where: {
                username: "testuser"
            }
        });
    }
}
