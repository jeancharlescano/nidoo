"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type SignUpState = {
  errors: {
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
  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,

      values: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
      },
    };
  }

  const hashedPassword = await bcrypt.hash(
    result.data.password + process.env.PEPPER,
    10,
  );

  const existingUser = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
  });

  if (existingUser) {
    return {
      errors: { email: ["Un compte avec cet email existe déjà."] },
      values: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
      },
    };
  }

  const user = await prisma.user.create({
    data: {
      firstName: result.data.firstName as string,
      lastName: result.data.lastName,
      email: result.data.email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}
