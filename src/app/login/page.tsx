import IntroHeader from "@/components/IntroHeader";
import SignInForm from "@/components/auth/SignInForm";
import { resendVerificationEmail } from "@/lib/actions/auth/resend-verification-email";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; code?: string; email?: string }>;
}) {
  const { error, code, email } = await searchParams;
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Bon retour 👋</h2>
      <p className="text-[#6B7280] mb-8">
        Connectez-vous pour retrouver le suivi de votre bébé.
      </p>
      {error && (
        <>
          {code === "email_not_verified" ? (
            <>
              <p className="text-red-500 text-sm mb-2">
                Veuillez vérifier votre adresse e-mail avant de vous connecter.
              </p>

              {email && (
                <form action={resendVerificationEmail} className="mb-4">
                  <input type="hidden" name="email" value={email} />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-red-500 cursor-pointer underline"
                  >
                    Renvoyer le mail de vérification
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="text-red-500 text-sm mb-4">
              Email ou mot de passe incorrect.
            </p>
          )}
        </>
      )}
      <SignInForm />
      <div className="bg-[#EAF4EE] w-full p-4 rounded-xl ">
        <p className="text-sm font-bold mb-2">🍼 1 clic = 1 action</p>
        <p className="text-sm font-medium text-[#6B7280]">
          Repas, sommeil et couches restent accessibles en quelques secondes.
        </p>
      </div>
    </div>
  );
}
