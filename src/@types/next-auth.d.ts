// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName: string | null;
    lastName: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }
}
