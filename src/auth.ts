import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "./lib/zod";
import { pepperPassword } from "./lib/password";
import { findUserByEmail } from "./lib/user/queries";

import { CredentialsSignin } from "next-auth";

class EmailNotVerified extends CredentialsSignin {
  code = "email_not_verified";
}

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

        const user = await findUserByEmail(email);

        if (!user) return null;

        const hmacPassword = pepperPassword(inputPassword);
        if (!(await bcrypt.compare(hmacPassword, user.password))) return null;

        if (!user.emailVerified) {
          throw new EmailNotVerified();
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const pathname = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      const publicRoutes = [
        "/login",
        "/sign-up",
        "/forgot-password",
        "/confirm-email",
        "/verify-email",
        "/create-baby",
      ];

      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },
});
