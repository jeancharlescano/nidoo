import { prisma } from "@/lib/prisma";

export const getHistoryEventsForExport = async (
  babyId: string,
  date: Date,
  period: "day" | "month",
) => {
  const start = new Date(date);
  const end = new Date(date);

  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  const [feedings, diapers, sleeps] = await Promise.all([
    prisma.feeding.findMany({
      where: {
        babyId,
        occurredAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    prisma.diaperChange.findMany({
      where: {
        babyId,
        occurredAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    prisma.sleepSession.findMany({
      where: {
        babyId,
        startAt: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);

  return [
    ...feedings.map((feeding) => ({
      id: feeding.id,
      type: "feeding" as const,
      occurredAt: feeding.occurredAt,
      data: feeding,
    })),

    ...diapers.map((diaper) => ({
      id: diaper.id,
      type: "diaper" as const,
      occurredAt: diaper.occurredAt,
      data: diaper,
    })),

    ...sleeps.map((sleep) => ({
      id: sleep.id,
      type: "sleep" as const,
      occurredAt: sleep.endAt ?? sleep.startAt,
      data: sleep,
    })),
  ].sort(
    (a, b) =>
      a.occurredAt.getTime() -
      b.occurredAt.getTime(),
  );
};