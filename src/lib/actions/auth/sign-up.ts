"use server";

import { sendVerificationEmail } from "@/lib/mail/verification-email";
import { pepperPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { emailExists } from "@/lib/user/queries";
import { signUpSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

export type SignUpState = {
  errors: {
    general?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    firstName?: string[];
    lastName?: string[];
  };
  values?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};
export async function signUpAction(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const zodResult = signUpSchema.safeParse({
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    firstName: firstName,
    lastName: lastName,
  });

  if (!zodResult.success) {
    return {
      errors: zodResult.error.flatten().fieldErrors,

      values: {
        firstName: typeof firstName === "string" ? firstName : "",
        lastName: typeof lastName === "string" ? lastName : "",
        email: typeof email === "string" ? email : "",
      },
    };
  }

  const normalizedEmail = zodResult.data.email.toLowerCase();

  if (await emailExists(normalizedEmail)) {
    return {
      errors: { email: ["Un compte avec cet email existe déjà."] },
      values: {
        firstName: zodResult.data.firstName,
        lastName: zodResult.data.lastName,
        email: zodResult.data.email,
      },
    };
  }


  const hmacPassword = pepperPassword(zodResult.data.password);
  const hashedPassword = await bcrypt.hash(hmacPassword, 10);

  const user = await prisma.user.create({
    data: {
      firstName: zodResult.data.firstName || null,
      lastName: zodResult.data.lastName || null,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(normalizedEmail, token);

    redirect("/confirm-email");
  }

  // const formDataSignIn: FormData = new FormData();
  // formDataSignIn.append("email", user.email);
  // formDataSignIn.append("password", zodResult.data.password);
  // formDataSignIn.append("redirectTo", "/dashboard");

  // try {
  //   await signIn("credentialsProvider", formDataSignIn);
  // } catch (error) {
  //   if (error instanceof AuthError) {
  //     console.error("[SIGNUP AUTO SIGNIN ERROR]", {
  //       type: error.type,
  //       cause: error.cause,
  //     });

  //     return {
  //       errors: {
  //         general: ["Votre compte a été créé, mais la connexion a échoué."],
  //       },
  //       values: {
  //         firstName: zodResult.data.firstName,
  //         lastName: zodResult.data.lastName,
  //         email: zodResult.data.email,
  //       },
  //     };
  //   }
  //   throw error;
  // }

  return { errors: {} };
}
