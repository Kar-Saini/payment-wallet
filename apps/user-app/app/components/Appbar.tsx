"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@repo/ui/button";

const Appbar = () => {
  const session = useSession();
  console.log(session);
  return (
    <div className="flex justify-between border-b px-4 shadow-md">
      <div className="text-lg flex flex-col justify-center font-semibold">
        PayTM
      </div>
      <div className="flex flex-col justify-center pt-2">
        {session.data?.user?.name || session.data?.user?.email}
        <Button onClick={session.data?.user ? signOut : signIn}>
          {session.data?.user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default Appbar;
