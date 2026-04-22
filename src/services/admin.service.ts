import { prismaClient } from "../utils/prisma.util.js";
import { BadRequestError } from "../errors/badRequest.error.js";

export class AdminService {
  static async getTransactions(username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { admin: true },
    });

    if (!user || !user.admin) {
      throw new BadRequestError("User is not an admin");
    }

    const transactions = await prismaClient.paymentHistory.findMany();

    return transactions.map(transaction => ({
      id: transaction.id,
      course_id: transaction.course_id,
      learner_id: transaction.learner_id,
      createdAt: transaction.createdAt,
      payment_method: transaction.payment_method,
      amount: transaction.amount,
      status: transaction.status,
    }));
  }

  static async getUsers(username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { admin: true },
    });

    if (!user || !user.admin) {
      throw new BadRequestError("User is not an admin");
    }

    const users = await prismaClient.user.findMany();

    return users.map(u => ({
      id: u.id,
      username: u.username,
      name: u.name,
      description: u.description,
      createdAt: u.createdAt,
      deletedAt: u.deletedAt,
      email: u.email,
    }));
  }
}
