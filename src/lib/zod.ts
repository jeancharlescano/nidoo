import { z, object } from "zod";

export const onBoardingSchema = object({
  firstname: z
    .string()
    .min(2, "Le prénom doit contenir au minimum 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastname: z
    .string()
    .min(2, "Le nom doit contenir au minimum 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
});
