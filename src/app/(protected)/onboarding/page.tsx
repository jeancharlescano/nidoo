import IntroHeader from "@/components/IntroHeader";
import OnBoardingForm from "@/components/auth/OnBoardingForm";

const OnBoardingPage = () => {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Votre profil</h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Quelque informations supplémentaires
      </p>
      <OnBoardingForm buttonText="Continuer" />
      {/* <Link
        href="/add-baby"
        className="block w-full text-center text-[#4F8A69] text-sm font-semibold underline hover:no-underline "
      >
        Passer cette étape
      </Link> */}
    </div>
  );
};

export default OnBoardingPage;
