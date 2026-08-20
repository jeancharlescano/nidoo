import { signOut } from "@/auth";

export default function DashboardPage() {
	return (
		<>
			<h1>Dashboard</h1>
			<form
				action={async (formData) => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Sign out</button>
			</form>
		</>
	);
}
