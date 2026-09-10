"use server";
import { auth } from "@/auth";
import { onBoardingSchema } from "../zod";
import { z } from "zod";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export type OnboardingState = {
  errors?: string[];
};

export async function onBoardingAction(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const userId = session.user.id;

  const zodResult = onBoardingSchema.safeParse({
    firstname: formData.get("firstName"),
    lastname: formData.get("lastName"),
  });

  if (!zodResult.success) {
    const fieldErrors = z.flattenError(zodResult.error).fieldErrors;
    return {
      errors: Object.values(fieldErrors).flat().filter(Boolean) as string[],
    };
  }

  let createdFamily = false;
  try {
    createdFamily = await prisma.$transaction(async (tx) => {
    const membership = await tx.familyMember.findFirst({ where: { userId } });
    await tx.user.update({
      where: { id: userId },
      data: {
        firstName: zodResult.data.firstname,
        lastName: zodResult.data.lastname,
        onBoarded: true,
      },
    });

    if (membership) return false;
    await tx.family.create({
      data: {
        name: "Famille de " + zodResult.data.firstname,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });

    return true;
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    console.error("Erreur update user onboarding:", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }

  redirect(createdFamily ? "/add-baby?source=onboarding" : "/dashboard");
}
