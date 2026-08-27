import AddBabyForm from "@/components/AddBabyForm";
import IntroHeader from "@/components/IntroHeader";

const CreateBaby = () => {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Créer le profil de bébé 👶</h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Ces informations serviront à personnaliser le suivi.
      </p>
      <AddBabyForm />
    </div>
  );
};

export default CreateBaby;
