// lib/user/queries.ts
import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase();
  return prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
}

export async function emailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}