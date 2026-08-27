import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Resend from "next-auth/providers/resend";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    Resend({
      from: "Nidoo <onboarding@resend.dev>",
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const pathname = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      const publicRoutes = [
        "/auth/login",
        "/auth/sign-up",
        "/auth/verify-request",
      ];

      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        return true;
      }

      return isLoggedIn;
    },
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.firstName = user.firstName || "";
        session.user.lastName = user.lastName || "";
      }
      return session;
    },
  },
});
