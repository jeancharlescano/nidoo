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
  if (!session?.user?.id) redirect("/login");

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

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: zodResult.data.firstname,
        lastName: zodResult.data.lastname,
      },
    });

    await prisma.family.create({
      data: {
        name: "Famille de " + zodResult.data.firstname,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onBoarded: true,
      },
    });
  } catch (error) {
    console.error("Erreur update user onboarding:", error);
    return {
      errors: ["Une erreur est survenue, veuillez réessayer."],
    };
  }

  redirect("/add-baby?source=onboarding");
}
