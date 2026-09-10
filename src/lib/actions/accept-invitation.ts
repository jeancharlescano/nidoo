"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { getInvitationByToken, getInvitationUser, getInvitationSenderMembership } from "@/lib/queries/invitationQueries";
import { membershipSnapshot } from "@/lib/utils/membershipSnapshot";
import { onBoardingSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type InvitationState = { error?: string };

export async function invitationSignInAction(token: string, _state: InvitationState): Promise<InvitationState> {
  void _state;
  const invitation = await getInvitationByToken(token);
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) {
    return { error: "Cette invitation n’est plus valide. Demandez une nouvelle invitation." };
  }
  try {
    await signIn("resend", { email: invitation.email, redirectTo: `/invite/${encodeURIComponent(token)}` });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Impossible d’envoyer le lien de connexion. Veuillez réessayer." };
  }
  return {};
}

export async function acceptInvitationAction(
  token: string, snapshot: string, _state: InvitationState, formData: FormData,
): Promise<InvitationState> {
  const session = await auth();
  if (!session?.user?.id) redirect(`/invite/${encodeURIComponent(token)}`);
  const userId = session.user.id;
  const result = onBoardingSchema.safeParse({
    firstname: formData.get("firstName"), lastname: formData.get("lastName"),
  });
  if (!result.success) return { error: result.error.issues[0].message };
  try {
    await prisma.$transaction((tx) => acceptInvitation(tx, {
      token, snapshot, userId,
      firstName: result.data.firstname, lastName: result.data.lastname,
      confirmed: formData.get("confirmSwitch") === "on",
    }), { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof InvitationError) return { error: error.message };
    console.error("[ACCEPT INVITATION]", error);
    return { error: "Le changement n’a pas été effectué. Rechargez la page puis réessayez." };
  }
  (await cookies()).delete("selectedBabyId");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function invitationSignOutAction(token: string) {
  await signOut({ redirectTo: `/invite/${encodeURIComponent(token)}` });
}

class InvitationError extends Error {}

async function acceptInvitation(
  tx: Prisma.TransactionClient,
  input: {
    token: string;
    userId: string;
    firstName: string;
    lastName: string;
    snapshot: string;
    confirmed: boolean;
  },
) {
  const invitation = await getInvitationByToken(input.token, tx);
  const user = await getInvitationUser(input.userId, tx);
  if (
    !invitation ||
    !user?.emailVerified ||
    user.email.toLowerCase() !== invitation.email.toLowerCase()
  ) {
    throw new InvitationError(
      "Connectez-vous avec l’adresse e-mail destinataire de cette invitation.",
    );
  }
  const memberships = user.memberships;
  if (memberships.some((member) => member.familyId === invitation.familyId))
    return;
  if (invitation.acceptedAt || invitation.expiresAt <= new Date()) {
    throw new InvitationError(
      "Cette invitation a déjà été utilisée ou a expiré. Demandez une nouvelle invitation.",
    );
  }
  const sender = await getInvitationSenderMembership(invitation.invitedById, invitation.familyId, tx);
  if (!sender)
    throw new InvitationError(
      "La personne qui vous a invité ne fait plus partie de cette famille.",
    );
  if (membershipSnapshot(memberships) !== input.snapshot) {
    throw new InvitationError(
      "Votre famille a changé depuis l’ouverture de cette page. Rechargez la page pour vérifier les conséquences.",
    );
  }
  if (memberships.length && !input.confirmed) {
    throw new InvitationError(
      "Confirmez le changement de famille pour continuer.",
    );
  }
  // Claim the invitation inside the same transaction as all destructive changes.
  const claimed = await tx.familyInvitation.updateMany({
    where: {
      id: invitation.id,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { acceptedAt: new Date() },
  });
  if (claimed.count !== 1)
    throw new InvitationError("Cette invitation n’est plus disponible.");

  for (const membership of memberships) {
    const remaining = membership.family.members
      .filter((member) => member.userId !== user.id)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (!remaining.length) {
      await tx.family.delete({ where: { id: membership.familyId } });
    } else {
      if (!remaining.some((member) => member.role === "ADMIN")) {
        await tx.familyMember.update({
          where: { id: remaining[0].id },
          data: { role: "ADMIN" },
        });
      }
      // Invitations issued by a departing member must no longer grant access.
      await tx.familyInvitation.deleteMany({
        where: {
          familyId: membership.familyId,
          invitedById: user.id,
          acceptedAt: null,
        },
      });
      await tx.familyMember.delete({ where: { id: membership.id } });
    }
  }
  await tx.familyMember.create({
    data: {
      userId: user.id,
      familyId: invitation.familyId,
      role: invitation.role,
    },
  });
  await tx.user.update({
    where: { id: user.id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      onBoarded: true,
    },
  });
}
