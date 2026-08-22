import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        try {
          formData.append("redirectTo", "/dashboard");
          await signIn("credentialsProvider", formData);
        } catch (error) {
          if (error instanceof AuthError) {
            return redirect("/login?error=CredentialsSignin");
          }
          throw error;
        }
      }}
    >
      <label className="flex flex-col text-sm font-semibold mb-4">
        Adresse e-mail
        <input
          className="border border-[#DDE5DF] px-2 p-3 rounded-xl text-[#6B7280] font-medium tracking-wider"
          name="email"
          type="email"
          placeholder="parent@email.com"
        />
      </label>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Password
        <input
          className="border border-[#DDE5DF] px-2 p-3 rounded-xl tracking-widest text-[#6B7280] font-semibold"
          name="password"
          type="password"
          placeholder="********"
        />
      </label>
      <div className="w-full flex justify-end mb-8">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-[#4F8A69] hover:underline cursor-pointer"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      <Button buttonText="Se connecter" />
      <div className="w-full flex justify-center mb-8">
        <p className="text-sm text-[#6B7280]">
          Pas encore de compte ?{" "}
          <Link
            href="/sign-up"
            className=" font-semibold text-[#4F8A69] hover:underline cursor-pointer"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </form>
  );
}
