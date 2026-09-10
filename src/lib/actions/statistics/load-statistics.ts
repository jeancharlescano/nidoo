"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getStatistics,
  type StatisticsPeriod,
} from "@/lib/queries/statisticsQueries";

export async function loadStatistics(babyId: string, period: StatisticsPeriod) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  if (!babyId || !["day", "week", "month"].includes(period))
    throw new Error("Période invalide");
  return getStatistics(session.user.id, babyId, period);
}
