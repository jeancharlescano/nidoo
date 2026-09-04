import { cookies } from "next/headers";

import { RecentHistoryList } from "@/components/dashboard/recent-history-list";
import { getDashboardEvents } from "@/lib/queries/dashboardQueries";
import { auth } from "@/auth";
import { getFamilyBabies } from "@/lib/queries/babyQueries";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
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
    <main className="flex flex-col gap-4 px-4 py-4">
      <h1 className="text-[20px] font-semibold text-[#1e2430]">Historique</h1>

      <RecentHistoryList
        babyId={babyId}
        initialEvents={events}
        initialCursor={nextCursor}
        pageSize={10}
        showSeeAll={false}
        todayOnly={false}
      />
    </main>
  );
}
