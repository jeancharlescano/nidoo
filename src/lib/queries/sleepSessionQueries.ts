import { prisma } from "../prisma";

export const getLastSleepSession = async (babyId: string) => {
  const lastSleepSession = await prisma.sleepSession.findFirst({
    orderBy: {
      startAt: "desc",
    },
    where: {
      babyId: babyId,
    },
  });

  return lastSleepSession;
};