import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
	return (
		<form
			action={async (formData) => {
				"use server";
				try {
					formData.append("redirectTo", "/dashboard");
					console.log("🚀 ~ SignIn ~ formData:", formData);
					await signIn("credentials", formData);
				} catch (error) {
					if (error instanceof AuthError)
						return redirect("/login?error=CredentialsSignin");
					throw error;
				}
			}}
		>
			<label className="flex flex-col text-sm font-semibold mb-4">
				Adresse e-mail
				<input
					className="border px-2 p-3 rounded-xl text-[#6B7280] font-medium tracking-wider"
					name="email"
					type="email"
				/>
			</label>
			<label className="flex flex-col text-sm font-semibold mb-4">
				Password
				<input
					className="border px-2 p-3 rounded-xl tracking-widest text-[#6B7280] font-semibold"
					name="password"
					type="password"
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
			<button
				type="submit"
				className="bg-[#4F8A69] text-white py-3 w-full rounded-xl text-md font-semibold mb-2 cursor-pointer"
			>
				Se connecter
			</button>
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
