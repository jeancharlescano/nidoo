import { prisma } from "@/lib/prisma";

export async function getCurrentBaby(userId: string) {
  return prisma.baby.findFirst({
    where: {
      family: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });
}

export async function getFamilyBabies(userId: string) {
  return prisma.baby.findMany({
    where: {
      family: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });
}
