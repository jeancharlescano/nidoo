import { prisma } from "@/lib/prisma";

export type StatisticsPeriod = "day" | "week" | "month";

export async function getStatistics(
  userId: string,
  babyId: string,
  period: StatisticsPeriod,
  selectedDate?: string,
) {
  const now = new Date();
  const start = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "week")
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  if (period === "month") start.setDate(1);
  const end = new Date(start);

  if (period === "month") end.setMonth(end.getMonth() + 1);
  else end.setDate(end.getDate() + (period === "week" ? 7 : 1));

  const cutoff = new Date(Math.min(now.getTime(), end.getTime()));
  const previousStart = new Date(start);

  if (period === "month") previousStart.setMonth(previousStart.getMonth() - 1);
  else
    previousStart.setDate(
      previousStart.getDate() - (period === "week" ? 7 : 1),
    );

  const previousEnd = new Date(
    Math.min(
      start.getTime(),
      end <= now
        ? start.getTime()
        : previousStart.getTime() +
            Math.max(0, cutoff.getTime() - start.getTime()),
    ),
  );

  const baby = { family: { members: { some: { userId } } } };
  const [feedings, diapers, sleeps, previousMilk] = await Promise.all([
    prisma.feeding.findMany({
      where: {
        babyId,
        baby,
        occurredAt: { gte: start, lt: end, lte: cutoff },
        type: "BOTTLE",
      },
      select: { occurredAt: true, quantityMl: true },
    }),

    prisma.diaperChange.findMany({
      where: { babyId, baby, occurredAt: { gte: start, lt: end, lte: cutoff } },
      select: { type: true },
    }),

    prisma.sleepSession.findMany({
      where: {
        babyId,
        baby,
        startAt: { lt: cutoff },
        OR: [{ endAt: { gt: start } }, { endAt: null }],
      },
      select: { startAt: true, endAt: true },
    }),

    prisma.feeding.aggregate({
      where: {
        babyId,
        baby,
        type: "BOTTLE",
        occurredAt: { gte: previousStart, lt: previousEnd },
      },
      _sum: { quantityMl: true },
    }),
  ]);

  const points: {
    label: string;
    description: string;
    quantityMl: number;
    future: boolean;
  }[] = [];

  const boundaries: number[] = [];
  const cursor = new Date(start);

  while (cursor < end) {
    boundaries.push(cursor.getTime());
    points.push({
      label:
        period === "day"
          ? `${cursor.getHours()}h`
          : period === "week"
            ? ["D", "L", "M", "M", "J", "V", "S"][cursor.getDay()]
            : String(cursor.getDate()),
      description: cursor.toLocaleString(
        "fr-FR",
        period === "day"
          ? { hour: "2-digit", minute: "2-digit" }
          : { weekday: "long", day: "numeric", month: "long" },
      ),
      quantityMl: 0,
      future: cursor > now,
    });

    if (period === "day") cursor.setTime(cursor.getTime() + 3_600_000);
    else cursor.setDate(cursor.getDate() + 1);
  }

  boundaries.push(end.getTime());

  for (const feeding of feedings) {
    const timestamp = feeding.occurredAt.getTime();
    const index = boundaries.findIndex(
      (boundary, i) => timestamp >= boundary && timestamp < boundaries[i + 1],
    );
    if (index >= 0) points[index].quantityMl += feeding.quantityMl ?? 0;
  }

  const quantityMl = feedings.reduce(
    (sum, feeding) => sum + (feeding.quantityMl ?? 0),
    0,
  );

  const sleepMinutes =
    sleeps.reduce(
      (sum, sleep) =>
        sum +
        Math.max(
          0,
          Math.min((sleep.endAt ?? cutoff).getTime(), cutoff.getTime()) -
            Math.max(sleep.startAt.getTime(), start.getTime()),
        ),
      0,
    ) / 60_000;

  const previousQuantity = previousMilk._sum.quantityMl ?? 0;

  return {
    period,
    selectedDate: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
    points,
    quantityMl,
    sleepMinutes,
    elapsedDays:
      period === "day"
        ? 1
        : Math.max(1, points.filter((point) => !point.future).length),
    peeCount: diapers.filter(
      (diaper) => diaper.type === "PEE" || diaper.type === "BOTH",
    ).length,
    poopCount: diapers.filter(
      (diaper) => diaper.type === "POOP" || diaper.type === "BOTH",
    ).length,
    milkChange:
      previousQuantity > 0
        ? Math.round(((quantityMl - previousQuantity) / previousQuantity) * 100)
        : null,
  };
}

export type StatisticsData = Awaited<ReturnType<typeof getStatistics>>;
