"use server";

import { getDashboardEvents } from "@/lib/queries/dashboardQueries";

export const loadMoreDashboardEvents = async (
  babyId: string,
  cursor: Date,
) => {
  return getDashboardEvents(babyId, 10, cursor);
};