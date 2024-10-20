"use server";
import prismaClient from "@repo/database/client";
import { Prisma } from "@prisma/client";
import getCurrentUser from "./getCurrentUser";

export async function p2pTransfer({
  amount,
  phoneNumber,
}: {
  amount: number;
  phoneNumber: string;
}) {
  try {
    const session = await getCurrentUser();

    if (!session || !session.user) {
      return { message: "Unauthorized request", status: 400 };
    }
    const findUser = await prismaClient.user.findUnique({
      where: { phoneNumber },
    });
    if (!findUser) {
      return { message: "Invalid phone number", status: 400 };
    }
    const checkUserBalance = await prismaClient.balance.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    if (!checkUserBalance) {
      return;
    }

    const p2pTransfer = await prismaClient.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await transaction.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${session?.user?.id} FOR UPDATE`;

        const senderBalance = await transaction.balance.findUnique({
          where: { userId: session?.user?.id },
        });
        if (!senderBalance || senderBalance.amount < amount * 100) {
          return { message: "Insufficient funds", status: 400 };
        }
        await transaction.balance.update({
          where: { userId: session?.user?.id },
          data: { amount: { decrement: amount * 100 } },
        });

        await transaction.balance.update({
          where: { userId: findUser.id },
          data: { amount: { increment: amount * 100 } },
        });
      }
    );
    console.log("Hello");
    console.log(p2pTransfer);
    return { message: "P2P transfer success", status: 200 };
  } catch (error) {
    return { message: "Something went wrong", status: 400 };
  }
}
