import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));
const email = emailSchema;

export const resendVerificationSchema = z.object({ email });

export const verifyEmailSchema = z.object({
  email,
  token: z.string().regex(/^[a-f0-9]{64}$/),
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email,
    // bcrypt only uses the first 72 bytes of a password.
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
