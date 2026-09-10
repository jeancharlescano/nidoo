"use client";

import { useState } from "react";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { loadStatistics } from "@/lib/actions/statistics/load-statistics";
import type {
  StatisticsData,
  StatisticsPeriod,
} from "@/lib/queries/statisticsQueries";

const periods = [
  { value: "day", label: "Jour", title: "Aujourd’hui" },
  { value: "week", label: "Semaine", title: "Cette semaine" },
  { value: "month", label: "Mois", title: "Ce mois-ci" },
] as const;

const number = (value: number) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

const duration = (value: number) => {
  const minutes = Math.round(value);
  const hours = Math.floor(minutes / 60);
  return hours
    ? `${hours} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, "0")}` : ""}`
    : `${minutes} min`;
};

export default function StatisticsOverview({
  babyId,
  initialData,
}: {
  babyId: string;
  initialData: StatisticsData;
}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const changePeriod = async (period: StatisticsPeriod) => {
    if (loading || period === data.period) return;
    setLoading(true);
    setError(null);
    try {
      setData(await loadStatistics(babyId, period));
      setActivePoint(null);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      setError("Impossible de charger les statistiques. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const maximum = Math.max(1, ...data.points.map((point) => point.quantityMl));
  const magnitude = 10 ** Math.floor(Math.log10(maximum / 4));
  const step = Math.max(1, Math.ceil(maximum / 4 / magnitude) * magnitude);
  const axisMaximum = step * 4;
  const selectedPoint = activePoint === null ? null : data.points[activePoint];
  return (
    <div aria-busy={loading} className="text-[#1f2937]">
      <div className="mb-6 flex gap-2" aria-label="Période des statistiques">
        {periods.map((period) => (
          <button
            key={period.value}
            type="button"
            disabled={loading}
            aria-pressed={data.period === period.value}
            onClick={() => changePeriod(period.value)}
            className={`h-10 rounded-xl border px-6 text-[14px] disabled:opacity-60 ${
              data.period === period.value
                ? "border-[#2e8b57] bg-[#eaf6ef] font-semibold text-[#2e8b57]"
                : "border-[#e5e7eb] bg-white text-[#1f2937]"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}
      <p role="status" className="sr-only">
        {loading ? "Chargement des statistiques…" : ""}
      </p>
      <h2 className="mb-3 text-[14px] font-bold">
        {periods.find((period) => period.value === data.period)?.title}
      </h2>
      <div className="grid grid-cols-2 gap-x-4.5 gap-y-3">
        <SummaryCard
          label="Repas"
          value={
            data.quantityMl >= 1000
              ? `${number(data.quantityMl / 1000)} L`
              : `${data.quantityMl} ml`
          }
          detail={
            data.milkChange === null
              ? "Pas de comparaison"
              : `${data.milkChange > 0 ? "+" : ""}${data.milkChange} %`
          }
          description="Quantité de lait des biberons. Variation par rapport à la même durée de la période précédente."
          tone="blue"
        />
        <SummaryCard
          label="Sommeil"
          value={duration(data.sleepMinutes)}
          detail={`${duration(data.sleepMinutes / data.elapsedDays)} / jour`}
          tone="purple"
        />
        <SummaryCard
          label="Pipis"
          value={String(data.peeCount)}
          detail={`${number(data.peeCount / data.elapsedDays)} / jour`}
          tone="blue"
        />
        <SummaryCard
          label="Selles"
          value={String(data.poopCount)}
          detail={`${number(data.poopCount / data.elapsedDays)} / jour`}
          tone="orange"
        />
      </div>
      <section className="mt-7" aria-labelledby="milk-chart-title">
        <h2 id="milk-chart-title" className="mb-3 text-[16px] font-bold">
          Quantité de lait
        </h2>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <p className="text-[11px] font-semibold text-[#6b7280]">
            mL / {data.period === "day" ? "heure" : "jour"}
          </p>
          <div className="flex min-h-12 items-center justify-center py-2 text-center text-xs" aria-live="polite">
            {selectedPoint ? (
              <p className="rounded-lg bg-[#edf3f9] px-3 py-1.5 text-[#1f2937]">
                {selectedPoint.description} · <strong>{selectedPoint.future ? "À venir" : `${number(selectedPoint.quantityMl)} mL`}</strong>
              </p>
            ) : (
              <p className="text-[#6b7280]">{data.quantityMl === 0
                ? "Aucun biberon enregistré sur cette période."
                : "Touchez ou survolez une barre pour voir la quantité."}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div aria-hidden="true" className="relative mb-5 h-30 w-9 shrink-0 text-right text-[10px] text-[#6b7280]">
              {[4, 3, 2, 1, 0].map((tick) => (
                <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${(4 - tick) * 25}%` }}>
                  {number(step * tick)}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1 overflow-x-auto">
              <div className="relative" style={{ minWidth: data.points.length * 20 }}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-30">
                  {[0, 25, 50, 75, 100].map((top) => <div key={top} className="absolute inset-x-0 border-t border-[#edf0f5]" style={{ top: `${top}%` }} />)}
                </div>
                <div className="relative flex gap-1" role="group" aria-label="Quantités de lait enregistrées">
            {data.points.map((point, index) => (
              <button
                key={index}
                type="button"
                aria-label={`${point.description} : ${point.future ? "à venir" : `${point.quantityMl} mL`}`}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setActivePoint(index); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") setActivePoint(null); }}
                onFocus={() => setActivePoint(index)}
                onBlur={() => setActivePoint(null)}
                onClick={() => setActivePoint(index)}
                onKeyDown={(event) => { if (event.key === "Escape") setActivePoint(null); }}
                className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-[#4f7cac] focus-visible:-outline-offset-2"
              >
                <div
                  className="flex h-30 w-full items-end justify-center"
                  aria-hidden="true"
                >
                  <div
                    className={`w-full max-w-5.5 rounded-[7px] ${activePoint === index ? "bg-[#315d89]" : "bg-[#4f7cac]"}`}
                    style={{ height: `${(point.quantityMl / axisMaximum) * 100}%` }}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="h-3 text-[10px] font-semibold text-[#6b7280]"
                >
                  {data.period === "week" ||
                  index === 0 ||
                  index === data.points.length - 1 ||
                  (data.period === "day"
                    ? index % 6 === 0
                    : (index + 1) % 5 === 0)
                    ? point.label
                    : ""}
                </span>
              </button>
            ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Link
        href="/history"
        className="mt-6 flex min-h-12 items-center rounded-[14px] bg-[#eaf6ef] px-3 py-3 text-[13px] font-semibold text-[#2e8b57]"
      >
        Voir le détail repas / sommeil / couches →
      </Link>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone,
  description,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "purple" | "orange";
  description?: string;
}) {
  const colors = {
    blue: "bg-[#edf3f9] text-[#4f7cac]",
    purple: "bg-[#f0ecff] text-[#7c5cfc]",
    orange: "bg-[#fff4e5] text-[#d97706]",
  };
  return (
    <div
      className="flex min-h-23.5 items-start gap-2.5 rounded-2xl border border-[#e5e7eb] bg-white p-3"
      title={description}
    >
      <span
        aria-hidden="true"
        className={`flex size-8.5 shrink-0 items-center justify-center rounded-[10px] text-[23px] font-bold ${colors[tone]}`}
      >
        •
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#6b7280]">{label}</p>
        <p className="mt-1 text-[20px] leading-6 font-bold wrap-break-word">
          {value}
        </p>
        <p className="mt-1 text-[11px] text-[#6b7280]">{detail}</p>
      </div>
    </div>
  );
}
