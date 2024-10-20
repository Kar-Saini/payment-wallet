import express from "express";
import prismaClient from "@repo/database/client";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Healthy server");
});

app.post("/hdfcWebhook", async (req, res) => {
  console.log(req.body);
  const { userId, token, amount } = req.body;
  try {
    await prismaClient.$transaction([
      prismaClient.balance.updateMany({
        where: { userId },
        data: { amount: { increment: Number(amount) } },
      }),
      prismaClient.onRampTransaction.updateMany({
        where: { token },
        data: { status: "Success" },
      }),
    ]);
    res.json({ message: "Captured" }).status(200);
  } catch (error) {}
});
app.listen(3003, () => {
  console.log("3003");
});
