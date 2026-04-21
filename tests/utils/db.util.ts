import { prismaClient } from "../../src/utils/prisma.util.js";

export class TestDbUtil {
    static async deleteUsers() {
        await prismaClient.learner.deleteMany({
            where: {
                user: {
                    username: {
                        in: ["testuser", "loginuser", "forgotuser", "forgotuser2"]
                    }
                }
            }
        });

        await prismaClient.user.deleteMany({
            where: {
                username: {
                    in: ["testuser", "loginuser", "forgotuser", "forgotuser2"]
                }
            }
        });
    }
}
