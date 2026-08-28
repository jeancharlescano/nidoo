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

export const babySchema = object({
  name: z
    .string()
    .min(2, "Le prénom doit contenir au minimum 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  dateOfBirth: z.coerce.date().refine((date) => date <= new Date(), {
    message: "La date ne peut pas être supérieure à la date du jour",
  }),
  sexe: z.string().min(1, "La valeur ne peut pas excéder 1 caractère").max(1),
  weight: z.coerce.number().positive("La valeur doit être supérieur à 0"),
});
