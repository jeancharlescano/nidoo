"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user/queries";
import { sendVerificationEmail } from "@/lib/mail/verification-email";

export async function resendVerificationEmail(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return;

  const user = await findUserByEmail(email);

  if (!user || user.emailVerified) return;

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  });

  await sendVerificationEmail(email, token);
}

type VerifyEmailResult = { success: true } | { success: false; error: string };

export default async function verifyEmailToken(
  token: string,
): Promise<VerifyEmailResult> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: token },
  });

  if (!verificationToken) {
    return { success: false, error: "Ce lien de vérification est invalide." };
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: token },
    });
    return {
      success: false,
      error: "Ce lien de vérification a expiré",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { token: token },
    }),
  ]);

  return { success: true };
}
