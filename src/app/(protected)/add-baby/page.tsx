import AddBabyForm from "@/components/AddBabyForm";
import IntroHeader from "@/components/IntroHeader";
import Link from "next/link";

const CreateBaby = async ({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) => {
  const { source } = await searchParams;
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">
        Créer le profil de bébé 👶
      </h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Ces informations serviront à personnaliser le suivi.
      </p>
      <AddBabyForm source={source}/>
      <p className="text-xs text-[#6B7280] text-center">
        Vous pourrez modifier ces informations plus tard.
      </p>
      <Link href="/">Passer cette étape</Link>
    </div>
  );
};

export default CreateBaby;
