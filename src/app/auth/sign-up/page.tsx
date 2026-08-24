import IntroHeader from "@/components/IntroHeader";
import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";
const SignUp = () => {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Créer votre compte</h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Votre email suffit pour commencer.
      </p>
      <SignInForm buttonText="Créer mon compte" />
      <div className="w-full flex justify-center mt-2">
        <Link
          href="/login"
          className=" font-semibold text-sm text-[#4F8A69] hover:underline cursor-pointer"
        >
          Déjà inscrit ? Se connecter
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
