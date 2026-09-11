"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getStatistics,
  type StatisticsPeriod,
} from "@/lib/queries/statisticsQueries";

export async function loadStatistics(
  babyId: string,
  period: StatisticsPeriod,
  selectedDate?: string,
) {
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/login");
  if (!babyId || !["day", "week", "month"].includes(period))
    throw new Error("Période invalide");

  if (selectedDate !== undefined) {
    if (
      typeof selectedDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
    )
      throw new Error("Date invalide");
    const parsed = new Date(selectedDate + "T00:00:00");
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== Number(selectedDate.slice(0, 4)) ||
      parsed.getMonth() + 1 !== Number(selectedDate.slice(5, 7)) ||
      parsed.getDate() !== Number(selectedDate.slice(8, 10))
    )
      throw new Error("Date invalide");
  }
  return getStatistics(session.user.id, babyId, period, selectedDate);
}
