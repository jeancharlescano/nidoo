import { object, string } from "zod";

export const signInSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
});

export const signUpSchema = signInSchema
  .extend({
    confirmPassword: string({ error: "Confirm password is required" })
      .min(1, "Confirm password is required")
      .min(8, "Confirm password must be more than 8 characters"),

    firstName: string({ error: "Firstname is required" }).optional(),
    lastName: string({ error: "Lastname is required" }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
