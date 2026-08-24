import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Button from "../ui/Button";

type Props = {
  buttonText: string;
};

export default function SignIn({ buttonText }: Props) {
  return (
    <form
      action={async (formData) => {
        "use server";
        try {
          await signIn("resend", {
            email: formData.get("email"),
            redirectTo: "/auth/post-auth",
          });
        } catch (error) {
          if (isRedirectError(error)) throw error;
          console.log("🚀 ~ SignIn ~ error:", error);
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
          required
        />
      </label>
      <Button buttonText={buttonText} />
    </form>
  );
}
