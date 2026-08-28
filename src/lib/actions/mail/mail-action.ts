"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import z from "zod";

export type InviteMemberState = {
  errors?: string[];
  success?: string;
};

export async function inviteMemberAction(
  _previousState: InviteMemberState,
  formData: FormData,
): Promise<InviteMemberState> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const zodResult = emailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!zodResult.success) {
    const fieldErrors = z.flattenError(zodResult.error).fieldErrors;
    return {
      errors: Object.values(fieldErrors).flat().filter(Boolean) as string[],
    };
  }

  try {
    const family = await prisma.family.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!family) {
      console.error("[INVITE] Famille introuvable");
      return { errors: ["Vous ne faites parti d'aucune famille"] };
    }

    const token = crypto.randomUUID();

    await prisma.familyInvitation.create({
      data: {
        email: zodResult.data.email,
        token: token,
        familyId: family.id,
        invitedById: session.user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    const resend = new Resend(process.env.AUTH_RESEND_KEY);

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

    const { error } = await resend.emails.send({
      from: "Nidoo <onboarding@resend.dev>",
      to: zodResult.data.email,
      subject: "Invitation à rejoindre Nidoo",
      html: `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #F7FAF8;
      padding: 40px 16px;
      color: #111827;
    ">
      <div style="
        max-width: 520px;
        margin: 0 auto;
        background-color: #FFFFFF;
        border: 1px solid #DDE5DF;
        border-radius: 20px;
        padding: 32px;
      ">
        <p style="
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 24px;
        ">
          Nidoo 👶
        </p>
  
        <h1 style="
          font-size: 26px;
          line-height: 1.3;
          margin: 0 0 12px;
        ">
          Vous êtes invité à rejoindre une famille
        </h1>
  
        <p style="
          color: #6B7280;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 28px;
        ">
          ${session.user.firstName} ${session.user.lastName} t'invite à rejoindre sa famille sur Nidoo
          afin de suivre ensemble le quotidien de bébé.
        </p>
  
        <a
          href="${inviteUrl}"
          style="
            display: block;
            background-color: #4F8A69;
            color: #FFFFFF;
            text-decoration: none;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            padding: 14px 20px;
            border-radius: 12px;
          "
        >
          Rejoindre la famille
        </a>
  
        <p style="
          color: #9CA3AF;
          font-size: 12px;
          line-height: 1.5;
          margin-top: 28px;
          margin-bottom: 0;
          text-align: center;
        ">
          Cette invitation expire dans 7 jours.
        </p>
      </div>
    </div>
  `,
    });

    if (error) {
      console.error("[INVITATION EMAIL]", error);
      return {
        errors: ["Une erreur s'est produite lors de l'envoi du mail"],
      };
    }

    return {
      success: "Invitation envoyée avec succès",
    };
  } catch (error) {
    console.error("[INVITE MEMBER ERROR]", error);

    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }
}
