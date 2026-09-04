import { prisma } from "@/lib/prisma";

export const getDashboardEvents = async (
  babyId: string,
  limit = 5,
  before?: Date,
) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const dateFilter = before
    ? {
        gte: startOfDay,
        lt: before,
      }
    : {
        gte: startOfDay,
        lte: endOfDay,
      };

  const [feedings, diapers, sleeps] = await Promise.all([
    prisma.feeding.findMany({
      where: {
        babyId,
        occurredAt: dateFilter,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: limit + 1,
    }),

    prisma.diaperChange.findMany({
      where: {
        babyId,
        occurredAt: dateFilter,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: limit + 1,
    }),

    prisma.sleepSession.findMany({
      where: {
        babyId,
        startAt: dateFilter,
      },
      orderBy: {
        startAt: "desc",
      },
      take: limit + 1,
    }),
  ]);

  const allEvents = [
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
    
  ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());

  const events = allEvents.slice(0, limit);

  const hasMore = allEvents.length > limit;

  const lastEvent = events.at(-1);

  return {
    events,
    nextCursor: hasMore && lastEvent ? lastEvent.occurredAt : null,
  };
};
