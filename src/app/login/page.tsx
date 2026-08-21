import IntroHeader from "@/components/IntroHeader";
import SignInForm from "@/components/auth/SignInForm";
// export const dynamic = "force-dynamic";
export default async function Login({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;
	return (
		<div className="p-4">
			<IntroHeader />
			<h2 className="text-3xl mb-2 font-semibold">Bon retour 👋</h2>
			<p className="text-[#6B7280] mb-8">
				Connectez-vous pour retrouver le suivi de votre bébé.
			</p>
			{error && (
				<p className="text-red-500 text-sm mb-4">
					Email ou mot de passe incorrect.
				</p>
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
