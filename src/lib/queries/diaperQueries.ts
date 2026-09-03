import { prisma } from "../prisma";

export const getDiaperSummary = async (babyId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const diapers = await prisma.diaperChange.findMany({
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

  const lastDiaperChange = diapers[0] ?? null;

  const totalPee = diapers.filter(
    (diaper) => diaper.type === "PEE" || diaper.type === "BOTH",
  ).length;

  const totalPoop = diapers.filter(
    (diaper) => diaper.type === "POOP" || diaper.type === "BOTH",
  ).length;
	
  return {
    lastDiaperChange,
    totalPee,
    totalPoop,
  };
};
