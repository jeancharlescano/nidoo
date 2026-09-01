import { auth } from "@/auth";
import IntroHeader from "@/components/ui/IntroHeader";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const SummaryPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const baby = await prisma.baby.findFirst({
    where: {
      family: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-[#1F2937] text-3xl mb-2 font-semibold">
        Tout est prêt 🎉
      </h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Le profil de Léo est configuré. Vous pouvez commencer le suivi.
      </p>
      <section className="mb-12">
        <p className="text-[#1F2937] font-semibold">👶 {baby?.firstName}</p>
        <p className="text-[#6B7280] text-xs ">
          Né le{" "}
          {baby?.birthDate?.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </section>
      <section className="text-[#1F2937] text-xs mb-12">
        <p className=" font-semibold mb-2">
          Ce que vous pouvez faire maintenant
        </p>
        <p>
          <span className="flex gap-4 mb-1">
            <span>🍼 Ajouter un repas</span>
            <span>😴 Noter un sommeil</span>
          </span>
          <span>💧 Enregistrer une couche</span>
        </p>
      </section>
      <Link
        href="/dashboard"
        className="block text-center bg-[#4F8A69] text-white py-3 w-full rounded-xl text-md font-semibold mb-2 cursor-pointer"
      >
        Accéder au dashboard
      </Link>
      <p className="text-[#6B7280] mb-8 text-xs">
        Votre quotidien, centralisé en quelques secondes.
      </p>
    </div>
  );
};

export default SummaryPage;
