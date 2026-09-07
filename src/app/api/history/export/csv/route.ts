import { NextRequest } from "next/server";

import { getHistoryEventsForExport } from "@/lib/queries/historyQueries";
import { formatFeedingType } from "@/lib/utils/formatFeedingType";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const babyId = searchParams.get("babyId");
  const dateValue = searchParams.get("date");
  const period = searchParams.get("period");

  if (!babyId || !dateValue || (period !== "day" && period !== "month")) {
    return new Response("Paramètres invalides", {
      status: 400,
    });
  }

  const date = new Date(dateValue);

  const events = await getHistoryEventsForExport(babyId, date, period);

  const rows = [
    ["Date", "Heure", "Type", "Détail"],
    ...events.map((event) => [
      formatDate(event.occurredAt),
      formatTime(event.occurredAt),
      getEventType(event),
      getEventDetail(event),
    ]),
  ];

  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";"),
    )
    .join("\n");

  const filename =
    period === "day"
      ? `nidoo-${formatFileDate(date)}`
      : `nidoo-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`;

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}

const formatDate = (date: Date) => date.toLocaleDateString("fr-FR");

const formatTime = (date: Date) =>
  date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatFileDate = (date: Date) => date.toISOString().split("T")[0];

const getEventType = (event: any) => {
  if (event.type === "feeding") return "Repas";
  if (event.type === "diaper") return "Couche";
  if (event.type === "sleep") return "Sommeil";

  return "";
};

const getEventDetail = (event: any) => {
  if (event.type === "feeding") {
    return event.data.quantityMl
      ? `${formatFeedingType(event.data.type)} - ${event.data.quantityMl} ml`
      : formatFeedingType(event.data.type);
  }

  if (event.type === "diaper") {
    if (event.data.type === "PEE") return "Pipi";
    if (event.data.type === "POOP") return "Caca";

    return "Pipi + caca";
  }

  if (event.type === "sleep") {
    if (!event.data.endAt) return "En cours";

    const start = new Date(event.data.startAt);
    const end = new Date(event.data.endAt);

    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours} h ${remainingMinutes} min`;
  }

  return "";
};
