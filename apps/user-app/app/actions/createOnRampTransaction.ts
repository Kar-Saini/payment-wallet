"use server";
import prismaClient from "@repo/database/client";

import getCurrentUser from "./getCurrentUser";

const createOnRampTransaction = async ({
  amount,
  provider,
}: {
  amount: number;
  provider: string;
}) => {
  try {
    const session = await getCurrentUser();
    if (!session?.user || !session?.user?.id) {
      return { message: "Unauthenticated request", status: 404 };
    }

    const onRampTransaction = await prismaClient.onRampTransaction.create({
      data: {
        token: Math.random().toString(),
        status: "Pending",
        amount,
        provider,
        startTime: new Date(),
        userId: session.user.id,
      },
      include: { user: true },
    });
    return {
      message: "Transaction added",
      status: 200,
      data: {
        id: onRampTransaction.id,
        token: onRampTransaction.token,
        status: onRampTransaction.status,
      },
    };
  } catch (error) {
    return { message: "Invalid request", status: 404 };
  }
};
export default createOnRampTransaction;
