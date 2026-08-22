import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { signInSchema } from "./lib/zod";
import { pepperPassword } from "./lib/password";

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    signIn: "/login",
  },
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

        const { email, password: inputPassword } =
          await signInSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) return null;
        
        const hmacPassword = pepperPassword(inputPassword);
        if (!(await bcrypt.compare(hmacPassword, user.password))) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const pathname = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      const publicRoutes = ["/login", "/sign-up", "/forgot-password"];

      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },
});
