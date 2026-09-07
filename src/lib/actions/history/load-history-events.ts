"use server";

import { getHistoryEventsByDay } from "@/lib/queries/dashboardQueries";

export const loadHistoryEvents = async (
  babyId: string,
  date: Date,
  cursor?: Date,
) => {
  return getHistoryEventsByDay(
    babyId,
    date,
    10,
    cursor,
  );
};