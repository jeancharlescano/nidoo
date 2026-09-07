import { cookies } from "next/headers";
import { auth } from "@/auth";

import { getFamilyBabies } from "@/lib/queries/babyQueries";
import { getHistoryEventsByDay } from "@/lib/queries/dashboardQueries";
import { HistoryList } from "@/components/history/historyList";

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
  const today = new Date();

  const { events, nextCursor } = await getHistoryEventsByDay(babyId, today, 10);

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

      <HistoryList
        babyId={babyId}
        initialEvents={events}
        initialCursor={nextCursor}
        initialDate={today}
      />
    </main>
  );
}
