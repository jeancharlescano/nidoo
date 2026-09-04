"use client";

import { deleteDashboardEvent } from "@/lib/actions/dashboard/delete-dashboard-event";
import { loadMoreDashboardEvents } from "@/lib/actions/dashboard/load-more-dashboard-events";
import { useEffect, useRef, useState } from "react";

type DashboardEvent = {
  id: string;
  type: "feeding" | "diaper" | "sleep";
  occurredAt: Date;
  data: any;
};

type RecentHistoryListProps = {
  babyId: string;
  initialEvents: DashboardEvent[];
  initialCursor: Date | null;
};

export const RecentHistoryList = ({
  babyId,
  initialEvents,
  initialCursor,
}: RecentHistoryListProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(initialCursor);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (!cursor || loading) return;

    setLoading(true);

    const result = await loadMoreDashboardEvents(babyId, cursor);

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

  const handleShowAll = async () => {
    setShowAll(true);
    await loadMore();
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
    if (!showAll) return;
    if (!loaderRef.current) return;
    if (!cursor) return;

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
  }, [showAll, cursor, loading]);

  return (
    <section className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between font-semibold">
        <p className="text-[15px] text-[#1e2430]">Aujourd’hui</p>

        {!showAll && cursor && (
          <button
            type="button"
            onClick={handleShowAll}
            className="text-[11px] text-[#4F8A69]"
          >
            Voir tout
          </button>
        )}
      </div>

      <div className="relative w-full overflow-visible rounded-[22px] border border-[#edf0f5] bg-white p-2">
        {events.map((event, index) => (
          <div key={`${event.type}-${event.id}`}>
            <EventRow event={event} onDelete={handleDelete} />

            {index < events.length - 1 && (
              <div className="mx-1 h-px bg-[#eff1f5]" />
            )}
          </div>
        ))}

        {showAll && cursor && <div ref={loaderRef} className="h-px" />}

        {loading && (
          <p className="py-2 text-center text-[10px] text-[#7b8496]">
            Chargement...
          </p>
        )}
      </div>
    </section>
  );
};

const EventRow = ({
  event,
  onDelete,
}: {
  event: DashboardEvent;
  onDelete: (event: DashboardEvent) => Promise<void>;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    setDeleting(true);

    await onDelete(event);

    setDeleting(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
      className="relative flex h-10.25 items-center gap-2 px-1 py-1.25"
    >
      <p className="w-10 shrink-0 text-[11px] font-semibold text-[#7b8496]">
        {formatEventTime(event.occurredAt)}
      </p>

      <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#f4f6f9] text-[20px]">
        {getEventEmoji(event)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <p className="truncate text-[12px] font-semibold text-[#1e2430]">
          {getEventTitle(event)}
        </p>

        <p className="truncate text-[10px] text-[#7b8496]">
          {getEventDescription(event)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen((previous) => !previous)}
        className="h-7.5 w-7.5 shrink-0 text-[16px] font-bold text-[#aab1be]"
        aria-label="Options"
      >
        ⋯
      </button>

      {menuOpen && (
        <div className="absolute bottom-9 right-1 z-20 rounded-lg border border-[#edf0f5] bg-white p-1 shadow-md">
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="rounded-md px-3 py-2 text-[12px] font-semibold text-red-600"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      )}
    </div>
  );
};

const formatEventTime = (date: Date) => {
  return new Date(date)
    .toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");
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

const getEventTitle = (event: DashboardEvent) => {
  if (event.type === "diaper") {
    return "Couche";
  }

  if (event.type === "sleep") {
    return event.data.endAt ? "Réveil" : "Sommeil";
  }

  if (event.type === "feeding") {
    return "Repas";
  }

  return "";
};

const getEventDescription = (event: DashboardEvent) => {
  if (event.type === "diaper") {
    if (event.data.type === "POOP") {
      return "Selle";
    }

    if (event.data.type === "PEE") {
      return "Pipi";
    }

    return "Pipi + selle";
  }

  if (event.type === "sleep") {
    if (!event.data.endAt) {
      return "Début";
    }

    const startAt = new Date(event.data.startAt);
    const endAt = new Date(event.data.endAt);

    const duration = endAt.getTime() - startAt.getTime();

    const totalMinutes = Math.floor(duration / 1000 / 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} h ${minutes} de sommeil`;
    }

    if (hours > 0) {
      return `${hours} h de sommeil`;
    }

    return `${minutes} min de sommeil`;
  }

  if (event.type === "feeding") {
    if (event.data.type === "BOTTLE") {
      return "Biberon";
    }
    if (event.data.type === "BREAST") {
      return "Tétée";
    }
  }

  return "";
};
