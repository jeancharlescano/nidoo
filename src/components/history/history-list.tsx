"use client";

import { useEffect, useRef, useState } from "react";

import { loadMoreDashboardEvents } from "@/lib/actions/dashboard/load-more-dashboard-events";
import { deleteDashboardEvent } from "@/lib/actions/dashboard/delete-dashboard-event";

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
};

export const HistoryList = ({
  babyId,
  initialEvents,
  initialCursor,
}: Props) => {
  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (!cursor || loading) return;

    setLoading(true);

    const result = await loadMoreDashboardEvents(babyId, cursor, 10, false);

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
      <p className="mb-3 text-[14px] font-bold text-[#1f2937]">
        {formatHistoryDate(new Date())}
      </p>

      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <HistoryEventRow
            key={`${event.type}-${event.id}`}
            event={event}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {cursor && <div ref={loaderRef} className="h-4" />}

      {loading && (
        <p className="py-4 text-center text-xs text-[#6b7280]">Chargement...</p>
      )}
    </div>
  );
};

const HistoryEventRow = ({
  event,
  onDelete,
}: {
  event: DashboardEvent;
  onDelete: (event: DashboardEvent) => Promise<void>;
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
        onClick={() => setMenuOpen((previous) => !previous)}
        className="h-10 w-10 text-[18px] font-bold text-[#aab1be]"
        aria-label="Options"
      >
        ⋯
      </button>

      {menuOpen && (
        <div className="absolute bottom-[48px] right-2 z-30 rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-md">
          <button
            type="button"
            onClick={() => onDelete(event)}
            className="rounded-md px-3 py-2 text-[12px] font-semibold text-red-600"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
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

    return event.data.type;
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
