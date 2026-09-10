import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getFamilyBabies } from "@/lib/queries/babyQueries";
import { getStatistics } from "@/lib/queries/statisticsQueries";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";

const StatisticsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const babies = await getFamilyBabies(session.user.id);
  const selectedBabyId = (await cookies()).get("selectedBabyId")?.value;
  const babyId =
    babies.find((baby) => baby.id === selectedBabyId)?.id ?? babies[0]?.id;
  const statistics = babyId
    ? await getStatistics(session.user.id, babyId, "week")
    : null;
    
  return (
    <main className="px-5 pt-6 pb-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[24px] font-bold text-[#1f2937]">Statistiques</h1>
        </div>

        <p className="mt-1 text-[13px] text-[#6b7280]">
          Suis les tendances sans perdre la simplicité.
        </p>
      </div>
      {statistics && babyId ? (
        <StatisticsOverview
          key={babyId}
          babyId={babyId}
          initialData={statistics}
        />
      ) : (
        <p className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-sm text-[#6b7280]">
          Ajoutez un bébé pour retrouver ses statistiques ici.
        </p>
      )}
    </main>
  );
};

export default StatisticsPage;
