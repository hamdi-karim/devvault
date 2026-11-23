import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));
const email = emailSchema;

// 32 random bytes, hex encoded.
const token = z.string().regex(/^[a-f0-9]{64}$/);

// bcrypt only uses the first 72 bytes of a password.
const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

function passwordsMatch(data: { password: string; confirmPassword: string }): boolean {
  return data.password === data.confirmPassword;
}
const PASSWORDS_MISMATCH = { message: "Passwords do not match", path: ["confirmPassword"] };

export const resendVerificationSchema = z.object({ email });

// The email/token pair carried by emailed links (verification and password reset).
const emailLinkSchema = z.object({ email, token });

export const verifyEmailSchema = emailLinkSchema;

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, PASSWORDS_MISMATCH);

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ email, token, password: newPassword, confirmPassword: z.string() })
  .refine(passwordsMatch, PASSWORDS_MISMATCH);

export const resetLinkSchema = emailLinkSchema;
