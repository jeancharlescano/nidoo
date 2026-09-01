"use server";

import { auth } from "@/auth";
import { BabySex } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { babySchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import z from "zod";

export type CreateBabyState = {
  errors?: string[];
};
export async function createBabyAction(
  _previousState: CreateBabyState,
  formData: FormData,
): Promise<CreateBabyState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const zodResult = babySchema.safeParse({
    name: formData.get("name"),
    dateOfBirth: formData.get("dateOfBirth"),
    sexe: formData.get("sexe"),
    weight: formData.get("weight"),
  });

  if (!zodResult.success) {
    const fieldErrors = z.flattenError(zodResult.error).fieldErrors;
    return {
      errors: Object.values(fieldErrors).flat().filter(Boolean) as string[],
    };
  }

  try {
    const family = await prisma.family.findFirst({
      where: { members: { some: { userId: session.user.id } } },
    });

    if (!family) {
      console.error("[ADD BABY] Famille introuvable pour l'utilisateur", {
        userId: session.user.id,
      });
      return {
        errors: ["Une erreur est survenu lors de l'ajout du bébé à la famille"],
      };
    }

    await prisma.baby.create({
      data: {
        firstName: zodResult.data.name,
        birthDate: zodResult.data.dateOfBirth,
        sex: zodResult.data.sexe as BabySex,
        weight: zodResult.data.weight,
        family: {
          connect: {
            id: family.id,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur update user onboarding:", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }
  redirect("/invite-member");
}
