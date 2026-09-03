"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const wakeUp = async (
  sleepSessionId: string,
  babyId: string,
): Promise<void> => {
  try {
    await prisma.sleepSession.update({
      where: {
        id: sleepSessionId,
      },
      data: {
        endAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/${babyId}/sleep-session`);
  } catch (error) {
    console.error("[WAKEUP] Erreur lors du réveil de l'enfant", error);
  }
};
