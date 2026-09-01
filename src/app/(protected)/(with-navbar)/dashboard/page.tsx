import { auth } from "@/auth";
import BabySelect from "@/components/BabySelect";
import { getFamilyBabies } from "@/lib/queries/babyQueries";
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
      <section>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sm text-[#1E2430]">
            Ajouter maintenant
          </span>
          <span className="font-semibold text-xs text-[#4F8A69] bg-[#d8ffe9] px-2 rounded-lg py-1">
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
            href={`/dashboard/${babyId}/sleep`}
          />
        </div>
      </section>
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
