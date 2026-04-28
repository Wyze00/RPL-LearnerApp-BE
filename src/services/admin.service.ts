import { prismaClient } from "../utils/prisma.util.js";
import { BadRequestError } from "../errors/badRequest.error.js";
import type { PostTopUpWithdrawRequest } from "src/types/enrollment.type.js";

export class AdminService {
  static async getTransactions(username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      include: { admin: true },
    });

    if (!user || !user.admin) {
      throw new BadRequestError("User is not an admin");
    }

    const transactions = await prismaClient.paymentHistory.findMany({
      where: {
        payment_mode: 'COURSE'
      }
    });

    return transactions
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

  static async topUp(username: string, data: PostTopUpWithdrawRequest) {

    const user = await prismaClient.user.findUnique({
      where: {
        username
      },
      include: {
        wallet: true,
      }
    })

    return await prismaClient.$transaction(async () => {

        await prismaClient.paymentHistory.create({
          data: {
            amount: Number(data.amount),
            payment_method: data.paymentMethod as any,
            payment_mode: 'TOPUP',
            wallet_id: user!.wallet!.id,
            status: 'SUCCESS'
          }
        })

        const wallet = await prismaClient.wallet.update({
          where: {
            id: user!.wallet!.id,
          },
          data: {
            amount: user!.wallet!.amount + Number(data.amount),
          }
        })

        return {
          id: wallet.id,
          amount: wallet.amount,
        }
    })
  }

  static async withdraw(username: string, data: PostTopUpWithdrawRequest) {

    const user = await prismaClient.user.findUnique({
      where: {
        username
      },
      include: {
        wallet: true,
      }
    })

    return await prismaClient.$transaction(async () => {

        await prismaClient.paymentHistory.create({
          data: {
            amount: Number(data.amount),
            payment_method: data.paymentMethod as any,
            payment_mode: 'WITHDRAW',
            wallet_id: user!.wallet!.id,
            status: 'SUCCESS'
          }
        })

        const wallet = await prismaClient.wallet.update({
          where: {
            id: user!.wallet!.id,
          },
          data: {
            amount: user!.wallet!.amount - Number(data.amount),
          }
        })

        return {
          id: wallet.id,
          amount: wallet.amount,
        }
    })
  }

  static async getWallet(username: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      }
    })

    const wallet = await prismaClient.wallet.findUnique({
      where: {
        user_id: user!.id
      }
    })

    return wallet;
  }
}
