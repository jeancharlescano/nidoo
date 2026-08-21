import SignUpForm from "@/components/auth/SignUpForm";
import IntroHeader from "@/components/IntroHeader";

const SignUp = () => {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Créer votre compte</h2>
      <p className="text-[#6B7280] mb-8">
        Quelques informations suffisent pour commencer.
      </p>
      {/* {error && (
        <p className="text-red-500 text-sm mb-4">
          Email ou mot de passe incorrect.
        </p>
      )} */}
      <SignUpForm />

    </div>
  );
};

export default SignUp;
