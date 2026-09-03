"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sleepSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export type CreateSleepingState = {
  errors?: string[];
  success?: boolean;
};

export async function createSleepingSessionAction(
  _previousState: CreateSleepingState,
  formData: FormData,
): Promise<CreateSleepingState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const zodResult = sleepSchema.safeParse({
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
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
      console.error("[ADD FEEDING] Bébé introuvable pour l'utilisateur", {
        userId: session.user.id,
      });
      return {
        errors: ["Une erreur est survenu lors de l'ajout du repas de bébé"],
      };
    }
    await prisma.sleepSession.create({
      data: {
        babyId: babyId,
        startAt: zodResult.data.startAt,
        endAt: zodResult.data.endAt ?? null,
        createdAt: new Date(),
        createdBy: session.user.id,
      },
    });
    if (!zodResult.data.endAt) {
      revalidatePath(`/dashboard/${babyId}/sleep-session`);
      return { success: true };
    }
  } catch (error) {
    console.error("Erreur dans la création d'un repas:", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }
  redirect("/dashboard");
}
