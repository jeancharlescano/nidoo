"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type CreateFeedingState = {
  errors?: string[];
};

export async function createFeedingAction(
  _previousState: CreateFeedingState,
  formData: FormData,
): Promise<CreateFeedingState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  console.log("🚀 ~ createFeedingAction ~ formData:", formData);
  redirect("/dashboard");
}
