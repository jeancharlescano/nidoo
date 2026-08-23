"use server";

import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user/queries";
import { forgotPasswordSchema } from "@/lib/zod";
import { z } from "zod";

export type ForgotPasswordState = {
  errors: {
    general?: string[];
    email?: string[];
  };
  values?: {
    email?: string;
  };
  success?: boolean;
};

export async function forgotPasswordAction(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email");

  const zodResult = forgotPasswordSchema.safeParse({ email });

  if (!zodResult.success) {
    return {
      errors: z.flattenError(zodResult.error).fieldErrors,
      values: { email: typeof email === "string" ? email : "" },
    };
  }

  const user = await findUserByEmail(zodResult.data.email);

  if (user) {
    // TODO: générer un token de reset + envoyer le mail
    console.log("send mail to", user.email);
  }

  return { errors: {}, success: true, values: { email: zodResult.data.email } };
}
