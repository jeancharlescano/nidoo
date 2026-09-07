import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

  const pdf = await PDFDocument.create();

  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([595, 842]);
  let y = 790;

  const title =
    period === "day"
      ? `Historique - ${date.toLocaleDateString("fr-FR")}`
      : `Historique - ${date.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        })}`;

  page.drawText("Nidoo", {
    x: 40,
    y,
    size: 22,
    font: bold,
    color: rgb(0.18, 0.55, 0.34),
  });

  y -= 35;

  page.drawText(title, {
    x: 40,
    y,
    size: 15,
    font: bold,
  });

  y -= 35;

  for (const event of events) {
    if (y < 60) {
      page = pdf.addPage([595, 842]);
      y = 790;
    }

    const time = event.occurredAt.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const eventDate = event.occurredAt.toLocaleDateString("fr-FR");

    const label = getPdfLabel(event);

    page.drawText(`${eventDate} - ${time} - ${label}`, {
      x: 40,
      y,
      size: 11,
      font,
    });

    y -= 22;
  }

  if (events.length === 0) {
    page.drawText("Aucun evenement sur cette periode.", {
      x: 40,
      y,
      size: 11,
      font,
    });
  }

  const bytes = await pdf.save();
  const pdfBuffer = new Uint8Array(bytes).buffer;

  const filename =
    period === "day"
      ? `nidoo-${date.toISOString().split("T")[0]}`
      : `nidoo-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`;

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
    },
  });
}

const getPdfLabel = (event: any) => {
  if (event.type === "feeding") {
    return event.data.quantityMl
      ? `Repas - ${formatFeedingType(event.data.type)} - ${event.data.quantityMl} ml`
      : `Repas - ${formatFeedingType(event.data.type)}`;
  }

  if (event.type === "diaper") {
    if (event.data.type === "PEE") {
      return "Couche - Pipi";
    }

    if (event.data.type === "POOP") {
      return "Couche - Caca";
    }

    return "Couche - Pipi + caca";
  }

  if (event.type === "sleep") {
    if (!event.data.endAt) {
      return "Sommeil - En cours";
    }

    const start = new Date(event.data.startAt);
    const end = new Date(event.data.endAt);

    const totalMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `Sommeil - ${hours} h ${minutes} min`;
  }

  return "";
};
