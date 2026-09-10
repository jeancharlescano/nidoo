"use client";

import { useEffect, useRef, useState } from "react";

import { deleteDashboardEvent } from "@/lib/actions/dashboard/delete-dashboard-event";
import { loadHistoryEvents } from "@/lib/actions/history/load-history-events";
import { formatFeedingType } from "@/lib/utils/formatFeedingType";

type DashboardEvent = {
  id: string;
  type: "feeding" | "diaper" | "sleep";
  occurredAt: Date;
  data: any;
};

type Props = {
  babyId: string;
  initialEvents: DashboardEvent[];
  initialCursor: Date | null;
  initialDate: Date;
};

export const HistoryList = ({
  babyId,
  initialEvents,
  initialCursor,
  initialDate,
}: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLInputElement>(null);

  const handleToday = async () => {
    const today = new Date();

    const result = await loadHistoryEvents(babyId, today);

    setSelectedDate(today);
    setEvents(result.events);
    setCursor(result.nextCursor);
  };

  const handleYesterday = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await loadHistoryEvents(babyId, yesterday);

    setSelectedDate(yesterday);
    setEvents(result.events);
    setCursor(result.nextCursor);
  };

  const handleCalendar = async (value: string) => {
    console.log("toto");
    if (!value) return;

    const date = new Date(`${value}T12:00:00`);

    const result = await loadHistoryEvents(babyId, date);

    setSelectedDate(date);
    setEvents(result.events);
    setCursor(result.nextCursor);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isTodaySelected = isSameDay(selectedDate, today);
  const isYesterdaySelected = isSameDay(selectedDate, yesterday);
  const isCustomDateSelected = !isTodaySelected && !isYesterdaySelected;

  const loadMore = async () => {
    if (!cursor || loading) return;

    setLoading(true);

    const result = await loadHistoryEvents(babyId, selectedDate, cursor);

    setEvents((previousEvents) => {
      const existingEvents = new Set(
        previousEvents.map((event) => `${event.type}-${event.id}`),
      );

      const newEvents = result.events.filter(
        (event) => !existingEvents.has(`${event.type}-${event.id}`),
      );

      return [...previousEvents, ...newEvents];
    });

    setCursor(result.nextCursor);
    setLoading(false);
  };

  const handleDelete = async (event: DashboardEvent) => {
    await deleteDashboardEvent(event.id, event.type);

    setEvents((previousEvents) =>
      previousEvents.filter(
        (currentEvent) =>
          !(currentEvent.id === event.id && currentEvent.type === event.type),
      ),
    );
  };

  useEffect(() => {
    if (!cursor || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [cursor, loading]);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={handleToday}
          className={`h-10 rounded-xl border px-4 text-[14px] ${
            isTodaySelected
              ? "border-[#2e8b57] bg-[#eaf6ef] font-semibold text-[#2e8b57]"
              : "border-[#e5e7eb] bg-white text-[#1f2937]"
          }`}
        >
          Aujourd’hui
        </button>

        <button
          type="button"
          onClick={handleYesterday}
          className={`h-10 rounded-xl border px-6 text-[14px] ${
            isYesterdaySelected
              ? "border-[#2e8b57] bg-[#eaf6ef] font-semibold text-[#2e8b57]"
              : "border-[#e5e7eb] bg-white text-[#1f2937]"
          }`}
        >
          Hier
        </button>

        <div>
          <button
            type="button"
            onClick={() => {
              calendarRef.current?.showPicker();
            }}
            className={`h-10 rounded-xl border px-4 text-[14px] ${
              isCustomDateSelected
                ? "border-[#2e8b57] bg-[#eaf6ef] font-semibold text-[#2e8b57]"
                : "border-[#e5e7eb] bg-white text-[#1f2937]"
            }`}
          >
            Calendrier
          </button>

          <input
            ref={calendarRef}
            type="date"
            onChange={(e) => {
              console.log("date choisie :", e.target.value);
              handleCalendar(e.target.value);
            }}
            className="absolute h-0 w-0 opacity-0"
          />
        </div>
      </div>

      <p className="mb-3 text-[14px] font-bold capitalize text-[#1f2937]">
        {formatHistoryDate(selectedDate)}
      </p>
      <div className="flex flex-col gap-3 pb-20">
        {events.map((event) => (
          <HistoryEventRow
            key={`${event.type}-${event.id}`}
            event={event}
            onDelete={handleDelete}
            onOpen={() => setSelectedEvent(event)}
          />
        ))}
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>

      {cursor && <div ref={loaderRef} className="h-4" />}

      {loading && (
        <p className="py-4 text-center text-xs text-[#6b7280]">Chargement...</p>
      )}
      <div className="fixed bottom-24 left-0 right-0 z-40 px-5">
        <button
          type="button"
          onClick={() => setExportOpen(true)}
          className="h-10 w-full rounded-[14px] border border-[#e5e7eb] bg-white text-[14px] font-semibold text-[#1f2937]"
        >
          ⇩ Exporter
        </button>
      </div>

      {exportOpen && (
        <ExportModal
          babyId={babyId}
          selectedDate={selectedDate}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  );
};

const ExportModal = ({
  babyId,
  selectedDate,
  onClose,
}: {
  babyId: string;
  selectedDate: Date;
  onClose: () => void;
}) => {
  const exportHistory = async (period: "day" | "month") => {
    const params = new URLSearchParams({
      babyId,
      date: selectedDate.toISOString(),
      period,
    });

    await Promise.all([
      downloadFile(`/api/history/export/pdf?${params}`),
      downloadFile(`/api/history/export/csv?${params}`),
    ]);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[22px] bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[17px] font-semibold text-[#1f2937]">
              Exporter l’historique
            </p>

            <p className="mt-1 text-[12px] text-[#6b7280]">
              Le PDF et le CSV seront téléchargés.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#6b7280]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => exportHistory("day")}
            className="h-[52px] rounded-[14px] border border-[#e5e7eb] bg-white text-[14px] font-semibold text-[#1f2937]"
          >
            Exporter la journée
          </button>

          <button
            type="button"
            onClick={() => exportHistory("month")}
            className="h-[52px] rounded-[14px] border border-[#e5e7eb] bg-white text-[14px] font-semibold text-[#1f2937]"
          >
            Exporter le mois
          </button>
        </div>
      </div>
    </div>
  );
};

const downloadFile = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur pendant l'export");
  }

  const blob = await response.blob();

  const downloadUrl = URL.createObjectURL(blob);

  const disposition = response.headers.get("Content-Disposition");

  const filename = disposition?.match(/filename="(.+)"/)?.[1] ?? "export";

  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
};

const HistoryEventRow = ({
  event,
  onDelete,
  onOpen,
}: {
  event: DashboardEvent;
  onDelete: (event: DashboardEvent) => Promise<void>;
  onOpen: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (clickEvent: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(clickEvent.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      onClick={onOpen}
      className="relative flex h-[62px] items-center rounded-[14px] border border-[#e5e7eb] bg-white px-[14px]"
    >
      <p className="w-[54px] shrink-0 text-[12px] font-semibold text-[#6b7280]">
        {formatEventTime(event.occurredAt)}
      </p>

      <span className="mr-4 text-[22px]">{getEventEmoji(event)}</span>

      <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#1f2937]">
        {getHistoryLabel(event)}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((previous) => !previous);
        }}
        className="h-10 w-10 text-[18px] font-bold text-[#aab1be]"
      >
        ⋯
      </button>

      {menuOpen && (
        <div className="absolute bottom-[48px] right-2 z-30 rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-md">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className="rounded-md px-3 py-2 text-[12px] font-semibold text-red-600"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

const EventDetailsModal = ({
  event,
  onClose,
}: {
  event: DashboardEvent;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[22px] bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getEventEmoji(event)}</span>

            <div>
              <p className="text-[16px] font-semibold text-[#1f2937]">
                {getHistoryLabel(event)}
              </p>

              <p className="text-[12px] text-[#6b7280]">
                {formatEventTime(event.occurredAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#6b7280]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 text-[14px]">
          {event.type === "feeding" && (
            <>
              <DetailLine
                label="Type"
                value={formatFeedingType(event.data.type)}
              />

              {event.data.quantityMl && (
                <DetailLine
                  label="Quantité"
                  value={`${event.data.quantityMl} ml`}
                />
              )}

              <DetailLine
                label="Heure"
                value={formatEventTime(event.occurredAt)}
              />
            </>
          )}

          {event.type === "diaper" && (
            <>
              <DetailLine label="Type" value={getHistoryLabel(event)} />

              <DetailLine
                label="Heure"
                value={formatEventTime(event.occurredAt)}
              />
            </>
          )}

          {event.type === "sleep" && (
            <>
              <DetailLine
                label="Début"
                value={formatEventTime(event.data.startAt)}
              />

              {event.data.endAt && (
                <DetailLine
                  label="Fin"
                  value={formatEventTime(event.data.endAt)}
                />
              )}

              <DetailLine label="Durée" value={getSleepDuration(event)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailLine = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-[#edf0f5] pb-2">
      <span className="text-[#6b7280]">{label}</span>

      <span className="font-semibold text-[#1f2937]">{value}</span>
    </div>
  );
};

const getSleepDuration = (event: DashboardEvent) => {
  if (event.type !== "sleep" || !event.data.endAt) {
    return "En cours";
  }

  const startAt = new Date(event.data.startAt);
  const endAt = new Date(event.data.endAt);

  const totalMinutes = Math.floor(
    (endAt.getTime() - startAt.getTime()) / 1000 / 60,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} h ${minutes}`;
  }

  if (hours > 0) {
    return `${hours} h`;
  }

  return `${minutes} min`;
};

const formatEventTime = (date: Date) => {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatHistoryDate = (date: Date) => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const getEventEmoji = (event: DashboardEvent) => {
  if (event.type === "diaper") {
    if (event.data.type === "POOP") return "💩";
    if (event.data.type === "PEE") return "💧";

    return "💩";
  }

  if (event.type === "sleep") {
    return event.data.endAt ? "👀" : "😴";
  }

  if (event.type === "feeding") {
    return "🍼";
  }

  return "•";
};

const getHistoryLabel = (event: DashboardEvent) => {
  if (event.type === "feeding") {
    if (event.data.quantityMl) {
      return `${event.data.quantityMl} ml`;
    }

    return formatFeedingType(event.data.type);
  }

  if (event.type === "diaper") {
    if (event.data.type === "POOP") {
      return "Caca";
    }

    if (event.data.type === "PEE") {
      return "Pipi";
    }

    return "Pipi + caca";
  }

  if (event.type === "sleep") {
    if (!event.data.endAt) {
      return "Sommeil";
    }

    const startAt = new Date(event.data.startAt);

    const endAt = new Date(event.data.endAt);

    const totalMinutes = Math.floor(
      (endAt.getTime() - startAt.getTime()) / 1000 / 60,
    );

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    const duration =
      hours > 0
        ? `${hours} h${minutes ? ` ${minutes}` : ""}`
        : `${minutes} min`;

    return `Réveil · ${duration}`;
  }

  return "";
};
