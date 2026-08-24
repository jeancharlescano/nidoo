import IntroHeader from "@/components/IntroHeader";
import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";
export default async function Login() {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Bon retour 👋</h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Connectez-vous pour retrouver le suivi de votre bébé.
      </p>

      <SignInForm buttonText="Se connecter" />
      <div className="w-full flex justify-center mt-2">
        <p className="text-sm text-[#6B7280]">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/sign-up"
            className=" font-semibold text-[#4F8A69] hover:underline cursor-pointer"
          >
            Créer un compte
          </Link>
        </p>
      </div>
      <div className="bg-[#EAF4EE] w-full p-4 rounded-xl mt-8">
        <p className="text-sm font-bold mb-2">🍼 1 clic = 1 action</p>
        <p className="text-sm font-medium text-[#6B7280]">
          Repas, sommeil et couches restent accessibles en quelques secondes.
        </p>
      </div>
    </div>
  );
}
