"use server";

import { getDashboardEvents } from "@/lib/queries/dashboardQueries";

export const loadMoreDashboardEvents = async (
  babyId: string,
  cursor: Date,
  limit: number,
  todayOnly: boolean,
) => {
  return getDashboardEvents(
    babyId,
    limit,
    cursor,
    todayOnly,
  );
};