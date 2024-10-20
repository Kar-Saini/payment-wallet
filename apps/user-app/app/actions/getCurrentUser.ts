import { getServerSession } from "next-auth/next";
import { authOptions } from "../libs";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session as { user: { id: string } };
}
