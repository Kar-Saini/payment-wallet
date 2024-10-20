import prisma from "@repo/database/client";
import { AddMoney } from "../../components/AddMoney";
import { BalanceCard } from "../../components//BalanceCard";
import { OnRampTransactions } from "../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../libs/index";

async function getBalance() {
  "use server";
  const session = await getServerSession(authOptions);
  console.log(session);
  const balance = await prisma.balance.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });
  console.log(balance);
  return {
    amount: balance?.amount || 0,
    locked: balance?.lockedAmount || 0,
  };
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session?.user) {
    return {};
  }
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: { startTime: "desc" },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function () {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
