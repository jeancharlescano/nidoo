import { prisma } from "@/lib/prisma";

export const getFeedSummary = async (babyId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const feedings = await prisma.feeding.findMany({
    where: {
      babyId,
      occurredAt: {
        gte: startOfDay,
      },
    },
    orderBy: {
      occurredAt: "desc",
    },
  });

  const lastFeeding = feedings[0] ?? null;

  const totalQuantity = feedings.reduce((total, feeding) => {
    return total + (feeding.quantityMl ?? 0);
  }, 0);

  const bottleCount = feedings.filter(
    (feeding) => feeding.type === "BOTTLE",
  ).length;

  const breastCount = feedings.filter(
    (feeding) => feeding.type === "BREAST",
  ).length;

  return {
    lastFeeding,
    totalQuantity,
    bottleCount,
    breastCount,
  };
};
