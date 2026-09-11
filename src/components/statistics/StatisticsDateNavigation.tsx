"use client";

import { useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { StatisticsPeriod } from "@/lib/queries/statisticsQueries";

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value: string) => new Date(value + "T00:00:00");
const weekStart = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
};

export function periodLabel(value: string, period: StatisticsPeriod) {
  const date = parseDate(value);
  if (period === "month")
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  if (period === "week") {
    const start = weekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    } as const;
    return `Du ${start.toLocaleDateString("fr-FR", options)} au ${end.toLocaleDateString("fr-FR", options)}`;
  }
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function StatisticsDateNavigation({
  period,
  selectedDate,
  loading,
  onChange,
}: {
  period: StatisticsPeriod;
  selectedDate: string;
  loading: boolean;
  onChange: (date: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const date = parseDate(selectedDate);
    date.setDate(1);
    return date;
  });

  const trigger = useRef<HTMLButtonElement>(null);
  const selected = parseDate(selectedDate);

  const buttonClass =
    "flex min-h-10 min-w-10 items-center justify-center rounded-xl hover:bg-[#eaf6ef] focus-visible:outline-2 focus-visible:outline-[#2e8b57] disabled:opacity-40";

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const choose = (date: Date) => {
    close();
    void onChange(dateKey(date));
  };

  const move = (direction: number) => {
    const date = new Date(selected);
    if (period === "month") {
      date.setDate(1);
      date.setMonth(date.getMonth() + direction);
    } else
      date.setDate(date.getDate() + direction * (period === "week" ? 7 : 1));
    choose(date);
  };

  const moveView = (direction: number) => {
    const date = new Date(view);
    if (period === "month") date.setFullYear(date.getFullYear() + direction);
    else date.setMonth(date.getMonth() + direction);
    setView(date);
  };

  const first = weekStart(view);

  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(first);
    day.setDate(day.getDate() + index);
    return day;
  });

  const isSelected = (date: Date) =>
    period === "week"
      ? dateKey(weekStart(date)) === dateKey(weekStart(selected))
      : dateKey(date) === selectedDate;

  return (
    <div
      className="relative mt-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#e5e7eb] bg-white">
        <button
          type="button"
          className={buttonClass}
          disabled={loading}
          aria-label={
            period === "day"
              ? "Jour pr?c?dent"
              : period === "week"
                ? "Semaine pr?c?dente"
                : "Mois pr?c?dent"
          }
          onClick={() => move(-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          ref={trigger}
          type="button"
          disabled={loading}
          aria-expanded={open}
          aria-controls="statistics-calendar"
          onClick={() => setOpen(!open)}
          className={
            buttonClass +
            " flex-1 gap-2 px-1 text-center text-xs font-semibold text-[#2e8b57]"
          }
        >
          <CalendarDays size={16} className="shrink-0" />
          {periodLabel(selectedDate, period)}
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={loading}
          aria-label={
            period === "day"
              ? "Jour suivant"
              : period === "week"
                ? "Semaine suivante"
                : "Mois suivant"
          }
          onClick={() => move(1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {open && (
        <div
          id="statistics-calendar"
          role="region"
          aria-label="Choisir une p?riode"
          className="absolute inset-x-0 top-full z-20 mt-2 rounded-2xl border border-[#e5e7eb] bg-white p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveView(-1)}
              aria-label={
                period === "month"
                  ? "Ann?e pr?c?dente"
                  : "Mois pr?c?dent du calendrier"
              }
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold" aria-live="polite">
              {period === "month"
                ? view.getFullYear()
                : view.toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
            </p>
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveView(1)}
              aria-label={
                period === "month"
                  ? "Ann?e suivante"
                  : "Mois suivant du calendrier"
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
          {period === "month" ? (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, month) => {
                const date = new Date(view.getFullYear(), month, 1);
                const active =
                  selected.getFullYear() === view.getFullYear() &&
                  selected.getMonth() === month;
                return (
                  <button
                    key={month}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(date)}
                    className={
                      buttonClass +
                      " text-sm " +
                      (active ? "bg-[#eaf6ef] font-bold text-[#2e8b57]" : "")
                    }
                  >
                    {date.toLocaleDateString("fr-FR", { month: "short" })}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <p className="mb-2 text-center text-xs text-[#6b7280]">
                {period === "week"
                  ? "Choisissez un jour pour s?lectionner sa semaine."
                  : "Choisissez un jour."}
              </p>
              <div className="grid grid-cols-7 text-center text-xs text-[#6b7280]">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
              <div className="mt-1 grid grid-cols-7">
                {days.map((date) => (
                  <button
                    key={dateKey(date)}
                    type="button"
                    aria-label={periodLabel(dateKey(date), period)}
                    aria-pressed={isSelected(date)}
                    onClick={() =>
                      choose(period === "week" ? weekStart(date) : date)
                    }
                    className={
                      "min-h-10 rounded-lg text-sm hover:bg-[#eaf6ef] focus-visible:outline-2 focus-visible:outline-[#2e8b57] " +
                      (isSelected(date)
                        ? "bg-[#eaf6ef] font-bold text-[#2e8b57]"
                        : date.getMonth() !== view.getMonth()
                          ? "text-[#9ca3af]"
                          : "")
                    }
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </>
          )}
          <button
            type="button"
            className={buttonClass + " mt-2 w-full text-xs text-[#6b7280]"}
            onClick={close}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
