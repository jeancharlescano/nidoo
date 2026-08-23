import verifyEmailToken from "@/lib/actions/auth/resend-verification-email";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

const VerifyEmailPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="flex justify-center items-center py-4">
        <h1 className="text-2xl font-bold text-red-500">
          Lien de vérification invalide.
        </h1>
      </div>
    );
  }

  const verifEmailResult = await verifyEmailToken(token);
  if (!verifEmailResult.success) {
    return (
      <div className="flex flex-col justify-center items-center py-4">
        <p className="text-red-500 font-semibold mb-4">
          {verifEmailResult.error}
        </p>
        <Link
          href="/sign-up"
          className="text-[#4F8A69] font-semibold underline"
        >
          Retour à l'inscription
        </Link>
      </div>
    );
  }

  redirect("/create-baby");
};

export default VerifyEmailPage;
