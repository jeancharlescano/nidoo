import { auth } from "@/auth";
import IntroHeader from "@/components/ui/IntroHeader";
import OnBoardingForm from "@/components/forms/auth/OnBoardingForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onBoarded: true },
  });

  if (user?.onBoarded) {
    redirect("/");
  }
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-[#1F2937] text-3xl mb-2 font-semibold">
        Votre profil
      </h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Quelque informations supplémentaires
      </p>
      <OnBoardingForm buttonText="Continuer" />
    </div>
  );
};

export default OnBoardingPage;
