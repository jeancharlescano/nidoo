"use server";

import { cookies } from "next/headers";

export const setSelectedBaby = async (babyId: string) => {
  const cookieStore = await cookies();

  cookieStore.set("selectedBabyId", babyId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
};
