import { db } from "@/lib/db";
import { EMAIL_RESEND_COOLDOWN_MS, VERIFICATION_TOKEN_TTL_MS } from "@/lib/constants/auth";
import { canIssueToken, createToken, hashToken } from "@/lib/auth/tokens";
import { getAppUrl } from "@/lib/email/resend";
import { sendVerificationEmail } from "@/lib/email/verification-email";

// Verification tokens use the bare email as identifier (password reset tokens are prefixed).
export function createVerificationToken(email: string): Promise<string> {
  return createToken(email, VERIFICATION_TOKEN_TTL_MS);
}

export async function issueVerificationEmail(email: string): Promise<boolean> {
  const token = await createVerificationToken(email);
  const url = new URL("/api/auth/verify-email", getAppUrl());
  url.searchParams.set("token", token);
  url.searchParams.set("email", email);
  return sendVerificationEmail(email, url.toString());
}

// Single use: the token row is deleted whether or not it has expired.
export async function consumeVerificationToken(email: string, token: string): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const where = { identifier_token: { identifier: email, token: hashToken(token) } };
    const record = await tx.verificationToken.findUnique({ where });
    if (!record) return false;

    await tx.verificationToken.delete({ where });
    if (record.expires < new Date()) return false;

    const { count } = await tx.user.updateMany({
      where: { email },
      data: { emailVerified: new Date() },
    });
    return count > 0;
  });
}

export function canResendVerification(email: string): Promise<boolean> {
  return canIssueToken(email, VERIFICATION_TOKEN_TTL_MS, EMAIL_RESEND_COOLDOWN_MS);
}
