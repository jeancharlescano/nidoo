import { cookies } from "next/headers";
import { auth } from "@/auth";

import { getFamilyBabies } from "@/lib/queries/babyQueries";
import { getDashboardEvents } from "@/lib/queries/dashboardQueries";
import { HistoryList } from "@/components/history/history-list";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const babies = await getFamilyBabies(session.user.id);

  const cookieStore = await cookies();
  const selectedBabyId = cookieStore.get("selectedBabyId")?.value;

  const babyId = selectedBabyId ?? babies[0]?.id;

  if (!babyId) {
    return null;
  }

  const { events, nextCursor } = await getDashboardEvents(
    babyId,
    10,
    undefined,
    false,
  );

  return (
    <main className="px-5 pt-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[24px] font-bold text-[#1f2937]">Historique</h1>
        </div>

        <p className="mt-1 text-[13px] text-[#6b7280]">
          Tous les événements de la journée, clairement regroupés.
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          className="h-10 rounded-[12px] border border-[#2e8b57] bg-[#eaf6ef] px-4 text-[14px] font-semibold text-[#2e8b57]"
        >
          Aujourd’hui
        </button>

        <button
          type="button"
          className="h-10 rounded-[12px] border border-[#e5e7eb] bg-white px-6 text-[14px] text-[#1f2937]"
        >
          Hier
        </button>

        <button
          type="button"
          className="h-10 rounded-[12px] border border-[#e5e7eb] bg-white px-6 text-[14px] text-[#1f2937]"
        >
          Calendrier
        </button>
      </div>

      <HistoryList
        babyId={babyId}
        initialEvents={events}
        initialCursor={nextCursor}
      />
    </main>
  );
}
