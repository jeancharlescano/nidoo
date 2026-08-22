import IntroHeader from "@/components/IntroHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";

const ForgotPasswordPage = async () => {
  const emailSended: boolean = true;
  const sendMail = async () => {
    "use server";
    console.log("send mail");
  };
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Mot de passe oublié ?</h2>
      <p className="text-[#6B7280] mb-8">
        Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.
      </p>
      <form action={sendMail} className="">
        <label className="flex flex-col text-sm font-semibold mb-8">
          Adresse e-mail
          <input
            className="border border-[#DDE5DF] px-2 p-3 rounded-xl text-[#h6B7280] font-medium tracking-wider"
            name="email"
            type="email"
            placeholder="parent@gmail.com"
          />
        </label>
        <Button buttonText="Envoyer le lien" />
      </form>
      <Link
        href="/login"
        className="block bg-white text-black text-center border border-[#DDE5DF] py-3 w-full  rounded-xl text-md font-semibold cursor-pointer mt-2 mb-8"
      >
        Retour à la connexion
      </Link>
      {emailSended && (
        <div className="bg-[#EDF5FF] w-full p-4 rounded-xl ">
          <p className="text-sm font-bold mb-2">✓ E-mail envoyé</p>
          <p className="text-sm font-medium text-[#6B7280]">
            Pensez à vérifier vos courriers indésirables si vous ne le voyez
            pas.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
