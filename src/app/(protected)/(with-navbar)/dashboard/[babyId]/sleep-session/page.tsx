import AddSleepingSessionForm from "@/components/forms/AddSleepingSessionForm";
import { createSleepingSessionAction } from "@/lib/actions/sleep/create-sleeping-session";
import { wakeUp } from "@/lib/actions/sleep/wake-up";
import { getLastSleepSession } from "@/lib/queries/sleepSessionQueries";
import { formatDuration } from "@/lib/utils/formatDuration";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
type SleepSessionPageProps = {
  params: Promise<{
    babyId: string;
  }>;
};
const SleepSessionPage = async ({ params }: SleepSessionPageProps) => {
  const { babyId } = await params;

  const lastSleepSession = await getLastSleepSession(babyId);

  const isSleeping = lastSleepSession && lastSleepSession.endAt === null;

  return (
    <div className="px-4 pt-8">
      <div className="text-[#1F2937] flex items-center space-x-4 text-2xl font-semibold mb-2">
        <Link href="/dashboard">
          <ChevronLeft />
        </Link>
        <h2>Sommeil</h2>
      </div>
      <p className="text-[#6B7280] mb-4 text-sm">
        En direct ou saisi plus tard, selon votre rythme.
      </p>
      {isSleeping ? (
        <SleepingSessionInProgress sleepSession={lastSleepSession} />
      ) : (
        <StartSleepingSession babyId={babyId} />
      )}
      <h3 className="text-[#1F2937] font-semibold text-md mb-2">
        Ajouter manuellement
      </h3>
      <AddSleepingSessionForm />
    </div>
  );
};

const SleepingSessionInProgress = async ({
  sleepSession,
}: {
  sleepSession: any;
}) => {
  const wakeUpAction = wakeUp.bind(null, sleepSession.id, sleepSession.babyId);
  return (
    <div className="w-full bg-[#dfffed] p-4 flex justify-between items-center rounded-xl mb-4">
      <div>
        <p className="font-semibold text-sm text-[#4F8A69]">Sommeil en cours</p>
        <p className="font-bold text-2xl">
          Depuis{" "}
          {sleepSession.startAt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-[#6B7280]">
          {formatDuration(sleepSession.startAt)}
        </p>
      </div>
      <form action={wakeUpAction}>
        <button
          type="submit"
          className="p-4 bg-[#4F8A69] text-white rounded-xl"
        >
          <span>👀 Réveil</span>
        </button>
      </form>
    </div>
  );
};

const StartSleepingSession = ({ babyId }: { babyId: string }) => {
  const startSleepingAction = async (formData: FormData) => {
    "use server";

    formData.set(
      "startAt",
      new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );

    await createSleepingSessionAction({ errors: [] }, formData);
  };
  return (
    <div className="w-full bg-[#dfffed] p-4 rounded-xl mb-4">
      <form action={startSleepingAction}>
        <input type="hidden" name="babyId" value={babyId} />

        <button
          type="submit"
          className="p-4 bg-[#4F8A69] text-white rounded-xl w-full font-semibold"
        >
          <span>😴 Dodo maintenant</span>
        </button>
      </form>
    </div>
  );
};
export default SleepSessionPage;
