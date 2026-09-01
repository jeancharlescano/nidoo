"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { feedingSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import z from "zod";

export type CreateFeedingState = {
  errors?: string[];
};

export async function createFeedingAction(
  _previousState: CreateFeedingState,
  formData: FormData,
): Promise<CreateFeedingState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const feedingType =
    formData.get("feedingQty") === "custom"
      ? formData.get("customFeedingQty")
      : formData.get("feedingQty");

  const zodResult = feedingSchema.safeParse({
    feedingType: formData.get("feedingType"),
    feedingQty: feedingType,
    feedingTime: formData.get("feedingTime"),
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
    await prisma.feeding.create({
      data: {
        babyId: babyId,
        type: zodResult.data.feedingType,
        quantityMl: zodResult.data.feedingQty,
        occurredAt: zodResult.data.feedingTime,
        createdAt: new Date(),
        createdBy: session.user.id,
      },
    });
  } catch (error) {
    console.error("Erreur update user onboarding:", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }
  redirect("/dashboard");
}
