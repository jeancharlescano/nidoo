import { auth } from "@/auth";
import BabySelect from "@/components/BabySelect";
import { getFamilyBabies } from "@/lib/queries/babyQueries";
import { getDashboardEvents } from "@/lib/queries/dashboardQueries";
import { getDiaperSummary } from "@/lib/queries/diaperQueries";
import { getFeedSummary } from "@/lib/queries/feedingQueries";
import { getSleepSummary } from "@/lib/queries/sleepSessionQueries";
import { formatTimeAgo } from "@/lib/utils/formatTimeAgo";
import { RecentHistoryList } from "@/components/dashboard/recent-history-list";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ babyId?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const babies = await getFamilyBabies(session.user.id);

  const params = await searchParams;

  const babyId = params.babyId ?? babies[0]?.id;

  return (
    <div className="p-2">
      <header className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-[#7B8496] ">Bonjour 👋</p>
          <p className="font-semibold text-2xl text-[#1E2430]">
            Journée de <BabySelect babies={babies} selectedBabyId={babyId} />
          </p>
        </div>
        <Link href="/profile" className="rounded py-2 px-4 bg-[#E7EEFF]">
          {session.user?.firstName[0].toUpperCase()}
        </Link>
      </header>
      <section className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sm text-[#1E2430]">
            Ajouter maintenant
          </span>
          <span className="font-semibold text-xs text-[#4F8A69] bg-[#dfffed] px-2 rounded-lg py-1">
            1 clic = 1 action
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto justify-between">
          <CardStyle
            emote="🍼"
            label="Biberon"
            href={`/dashboard/${babyId}/feeding`}
          />
          <CardStyle
            emote="🤱"
            label="Tétée"
            href={`/dashboard/${babyId}/feeding`}
          />
          <CardStyle
            emote="👶"
            label="Couche"
            href={`/dashboard/${babyId}/diaper`}
          />
          <CardStyle
            emote="😴"
            label="Sommeil"
            href={`/dashboard/${babyId}/sleep-session`}
          />
        </div>
      </section>
      <FeedSummary babyId={babyId} />
      <div className="flex gap-2 mb-8">
        <DiaperSummary babyId={babyId} />
        <SleepingSummary babyId={babyId} />
      </div>
      <RecentHistory babyId={babyId} />
    </div>
  );
}

const CardStyle = ({
  emote,
  label,
  href,
}: {
  emote: string;
  label: string;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="bg-white flex items-center justify-center flex-col rounded-xl w-20 h-24 shrink-0"
    >
      <span className=" text-xl">{emote}</span>
      <span className=" text-xs font-semibold text-[#1E2430]">{label}</span>
    </Link>
  );
};

const FeedSummary = async ({ babyId }: { babyId: string }) => {
  const feedSummary = await getFeedSummary(babyId);

  if (!feedSummary.lastFeeding) {
    return (
      <div className="w-full rounded-[22px] border border-[#EDF0F5] bg-white p-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7.5 items-center justify-center rounded-full bg-[#EEF3FF]">
            <span className="text-xl">🍼</span>
          </div>

          <p className="text-sm font-semibold text-[#1E2430]">Repas</p>
        </div>

        <p className="mt-3 text-sm text-[#7B8496]">Aucun repas aujourd’hui</p>
      </div>
    );
  }

  const lastFeedingTime = feedSummary.lastFeeding.occurredAt.toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="w-full rounded-xl border border-[#EDF0F5] bg-white p-3.5 mb-4">
      <div className="mb-2 flex h-7.5 items-center justify-between">
        <div className="flex items-center gap-1.75">
          <div className="flex h-7.5 items-center justify-center rounded-full bg-[#EEF3FF]">
            <span className="text-xl">🍼</span>
          </div>

          <p className="text-sm font-semibold text-[#1E2430]">Repas</p>
        </div>

        <div className="rounded-full bg-[#F4F6F9] px-2.5 py-1.75">
          <p className="text-[11px] font-semibold text-[#697386]">
            {formatTimeAgo(feedSummary.lastFeeding.occurredAt)}
          </p>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-1.75">
        <p className="text-[23px] font-bold text-[#1E2430]">
          {lastFeedingTime}
        </p>

        <span className="text-sm text-[#AAB1BE]">•</span>

        {feedSummary.lastFeeding.quantityMl && (
          <p className="text-[17px] font-semibold text-[#4F8A69]">
            {feedSummary.lastFeeding.quantityMl} ml
          </p>
        )}
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-[17px] font-bold text-[#1E2430]">
            {feedSummary.totalQuantity} ml
          </p>
          <p className="text-[10px] font-medium text-[#7B8496]">
            Depuis minuit
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[17px] font-bold text-[#1E2430]">
            {feedSummary.bottleCount}
          </p>
          <p className="text-[10px] font-medium text-[#7B8496]">Biberons</p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[17px] font-bold text-[#1E2430]">
            {feedSummary.breastCount}
          </p>
          <p className="text-[10px] font-medium text-[#7B8496]">Tétées</p>
        </div>
      </div>
    </div>
  );
};

const DiaperSummary = async ({ babyId }: { babyId: string }) => {
  const diaperSummary = await getDiaperSummary(babyId);
  if (!diaperSummary.lastDiaperChange) {
    return (
      <div className="w-1/2 rounded-[22px] border border-[#EDF0F5] bg-white p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7.5 items-center justify-center rounded-full bg-[#EEF3FF]">
            <span className="text-xl">👶</span>
          </div>

          <p className="text-sm font-semibold text-[#1E2430]">Couche</p>
        </div>

        <p className="mt-3 text-sm text-[#7B8496]">Aucune couche aujourd’hui</p>
      </div>
    );
  }

  return (
    <div className="w-1/2 rounded-xl border border-[#EDF0F5] bg-white p-3.5 flex flex-col">
      <span className="mb-1">👶</span>
      <span className="text-sm text-[#1E2430] font-semibold">Couches</span>
      <span className="text-xs text-[#7B8496]">
        Dernier : {formatTimeAgo(diaperSummary.lastDiaperChange.occurredAt)}
      </span>
      <div className="flex gap-5">
        <div className="flex flex-col">
          <p className="text-[17px] font-bold text-[#1E2430]">
            {diaperSummary.totalPee}
          </p>
          <p className="text-[10px] font-medium text-[#7B8496]">Pipis</p>
        </div>

        <div className="flex flex-col ">
          <p className="text-[17px] font-bold text-[#1E2430]">
            {diaperSummary.totalPoop}
          </p>
          <p className="text-[10px] font-medium text-[#7B8496]">Selles</p>
        </div>
      </div>
    </div>
  );
};

const SleepingSummary = async ({ babyId }: { babyId: string }) => {
  const sleepingSummary = await getSleepSummary(babyId);
  if (!sleepingSummary.lastSleepingSession) {
    return (
      <div className="w-1/2 rounded-[22px] border border-[#EDF0F5] bg-white p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7.5 items-center justify-center rounded-full bg-[#EEF3FF]">
            <span className="text-xl">👶</span>
          </div>

          <p className="text-sm font-semibold text-[#1E2430]">Dodo</p>
        </div>

        <p className="mt-3 text-sm text-[#7B8496]">Aucun dodo aujourd’hui</p>
      </div>
    );
  }

  return (
    <div className="w-1/2 rounded-xl border border-[#EDF0F5] bg-white p-3.5 flex flex-col">
      <span className="mb-1">😴</span>
      <span className="text-sm text-[#1E2430] font-semibold">Dodos</span>
      <span className="text-xs text-[#7B8496]">
        Dernier :{" "}
        {sleepingSummary.lastSleepingSession?.endAt
          ? formatTimeAgo(sleepingSummary.lastSleepingSession.endAt)
          : "En cours"}
      </span>
      <div className="flex flex-col">
        <p className="text-[17px] font-bold text-[#1E2430]">
          {sleepingSummary.totalSleepFormatted}
        </p>
        <p className="text-[10px] font-medium text-[#7B8496]">Aujourd'hui</p>
      </div>
    </div>
  );
};

const RecentHistory = async ({ babyId }: { babyId: string }) => {
  const { events, nextCursor } = await getDashboardEvents(babyId, 4);

  return (
    <RecentHistoryList
      babyId={babyId}
      initialEvents={events}
      initialCursor={nextCursor}
    />
  );
};
