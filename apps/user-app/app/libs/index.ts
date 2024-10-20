import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismaClient from "@repo/database/client";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: {
          type: "text",
          placeholder: "1234567890",
          label: "Phone Number",
        },
        password: {
          type: "password", // Correct input type for password
          placeholder: "*******",
          label: "Password",
        },
      },
      async authorize(credentials: { phoneNumber: string; password: string }) {
        const { phoneNumber, password } = credentials;
        try {
          // Check if user exists
          const userExists = await prismaClient.user.findUnique({
            where: { phoneNumber },
          });

          if (userExists) {
            const isUserValid = await bcrypt.compare(
              password,
              userExists.password
            );
            if (isUserValid) {
              return {
                id: userExists.id,
                email: userExists.email,
                phoneNumber: userExists.phoneNumber,
              };
            }
            return null;
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prismaClient.user.create({
            data: { password: hashedPassword, phoneNumber },
          });

          return {
            id: newUser.id,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
          };
        } catch (error) {
          console.error("Error in authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: "mysecret",
  callbacks: {
    async session({ token, session }: any) {
      session.user = session.user || {};
      session.user.id = token.sub;
      return session;
    },
  },
};
