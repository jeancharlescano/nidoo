import { z, object, email } from "zod";

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

export const emailSchema = object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Veuillez saisir une adresse e-mail valide")),
});

export const feedingSchema = object({
  feedingType: z.enum(["BOTTLE", "BREAST"], {
    error: "Le type de repas doit être soit Biberon soit Tétée",
  }),
  feedingQty: z.coerce.number().positive("La quantité doit être supérieur à 0"),
  feedingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "L'heure du repas n'est pas valide")
    .transform((time) => {
      const [hours, minutes] = time.split(":").map(Number);

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date;
    }),
});

export const diaperSchema = object({
  diaperType: z.enum(["PEE", "POOP", "BOTH"], {
    error: "Le type de change doit être soit Pipi soit Caca soit les deux",
  }),
  diaperTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "L'heure du change n'est pas valide")
    .transform((time) => {
      const [hours, minutes] = time.split(":").map(Number);

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date;
    }),
});
