import { redirect } from "next/navigation";

import getCurrentUser from "./actions/getCurrentUser";

export default async function Page() {
  const session = await getCurrentUser();
  if (session?.user) {
    redirect("/dashboard");
  } else {
    redirect("/api/auth/signin");
  }
}
