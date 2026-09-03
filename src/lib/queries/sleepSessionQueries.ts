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

export const getSleepSummary = async (babyId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const sleepingSessions = await prisma.sleepSession.findMany({
    where: {
      babyId,
      endAt: {
        gte: startOfDay,
      },
    },
    orderBy: {
      endAt: "desc",
    },
  });

  const lastSleepingSession = sleepingSessions[0] ?? null;

  const totalSleepMs = sleepingSessions.reduce((total, session) => {
    if (!session.endAt) return total;

    return total + (session.endAt.getTime() - session.startAt.getTime());
  }, 0);

  const totalMinutes = Math.floor(totalSleepMs / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const totalSleepFormatted =
    minutes === 0 ? `${hours}h` : `${hours}h ${minutes}`;

  return {
    lastSleepingSession,
    totalSleepFormatted,
  };
};
