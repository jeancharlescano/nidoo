import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { signInSchema } from "./lib/zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
	providers: [
		Credentials({
			id: "credentialsProvider",
			name: "Credentials",
			credentials: {
				email: { Label: "email", type: "email" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				console.log("🚀 ~ credentials:", credentials)
				if (!credentials) return null;

				const { email, password: inputPassword } =
					await signInSchema.parseAsync(credentials);

				const user = await prisma.user.findUnique({
					where: {
						email: email,
					},
				});

				console.log("🚀 ~ user:", user)
				if (!user || !(await bcrypt.compare(inputPassword, user.password)))
					return null;

				const { password, ...userWithoutPassword } = user;
				console.log("🚀 ~ userWithoutPassword:", userWithoutPassword)
				return userWithoutPassword;
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
});
