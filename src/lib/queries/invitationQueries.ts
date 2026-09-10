import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function getInvitationByToken(token: string, db: Prisma.TransactionClient = prisma) {
  return db.familyInvitation.findUnique({
    where: { token },
    include: { family: true },
  });
}

export function getInvitationUser(userId: string, db: Prisma.TransactionClient = prisma) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: { include: { family: { include: { members: true } } } },
    },
  });
}

export function getInvitationSenderMembership(
  userId: string,
  familyId: string,
  db: Prisma.TransactionClient = prisma,
) {
  return db.familyMember.findUnique({
    where: { userId_familyId: { userId, familyId } },
  });
}
