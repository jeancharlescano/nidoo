"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { diaperSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import z from "zod";

export type CreateDiaperState = {
  errors?: string[];
  success?: boolean;
};

export async function createDiaperAction(
  _previousState: CreateDiaperState,
  formData: FormData,
): Promise<CreateDiaperState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const zodResult = diaperSchema.safeParse({
    diaperType: formData.get("diaperType"),
    diaperTime: formData.get("diaperTime"),
  });

  if (!zodResult.success) {
    const fieldErrors = z.flattenError(zodResult.error).fieldErrors;
    return {
      errors: Object.values(fieldErrors).flat().filter(Boolean) as string[],
    };
  }

  try {
    const babyId = formData.get("babyId") as string;

    const baby = await prisma.baby.findFirst({
      where: {
        id: babyId,
        family: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!baby) {
      console.error("[ADD DIAPER] Bébé introuvable pour l'utilisateur", {
        userId: session.user.id,
      });
      return {
        errors: ["Une erreur est survenu lors de l'ajout de la couche de bébé"],
      };
    }
    await prisma.diaperChange.create({
      data: {
        babyId: babyId,
        type: zodResult.data.diaperType,
        occurredAt: zodResult.data.diaperTime,
        createdAt: new Date(),
        createdBy: session.user.id,
      },
    });
  } catch (error) {
    console.error("Erreur dans la création d'une couche :", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }
  redirect("/dashboard");
}
