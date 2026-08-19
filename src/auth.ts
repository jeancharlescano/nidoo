import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      id: "credentialsProvider",
      name: "Credentials",
      credentials: {
        email: { Label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
});
