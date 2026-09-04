"use server";

import { prisma } from "@/lib/prisma";

export const deleteDashboardEvent = async (
  id: string,
  type: "feeding" | "diaper" | "sleep",
) => {
  if (type === "feeding") {
    await prisma.feeding.delete({
      where: { id },
    });
  }

  if (type === "diaper") {
    await prisma.diaperChange.delete({
      where: { id },
    });
  }

  if (type === "sleep") {
    await prisma.sleepSession.delete({
      where: { id },
    });
  }

  return { success: true };
};