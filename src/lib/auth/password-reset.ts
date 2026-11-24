import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { createTokenWithCooldown, hashToken, resetIdentifier } from "@/lib/auth/tokens";
import { BCRYPT_ROUNDS, EMAIL_RESEND_COOLDOWN_MS, PASSWORD_RESET_TOKEN_TTL_MS } from "@/lib/constants/auth";
import { getAppUrl } from "@/lib/email/resend";
import { sendPasswordResetEmail } from "@/lib/email/password-reset-email";

// Sends nothing (returns false) while the per-email cooldown is active.
export async function issuePasswordResetEmail(email: string): Promise<boolean> {
  const token = await createTokenWithCooldown(
    resetIdentifier(email),
    PASSWORD_RESET_TOKEN_TTL_MS,
    EMAIL_RESEND_COOLDOWN_MS,
  );
  if (!token) return false;

  const url = new URL("/reset-password", getAppUrl());
  url.searchParams.set("token", token);
  url.searchParams.set("email", email);
  return sendPasswordResetEmail(email, url.toString());
}

// Read-only check so the reset page can show an error before the user types a new password.
export async function isPasswordResetTokenValid(email: string, token: string): Promise<boolean> {
  const record = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier: resetIdentifier(email), token: hashToken(token) } },
    select: { expires: true },
  });
  return record !== null && record.expires > new Date();
}

// Single use: the token row is deleted whether or not it has expired.
export async function resetPassword(email: string, token: string, password: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const identifier = resetIdentifier(email);

  return db.$transaction(async (tx) => {
    const where = { identifier, token: hashToken(token) };
    const record = await tx.verificationToken.findFirst({ where, select: { expires: true } });
    if (!record) return false;

    // deleteMany doesn't throw when a concurrent submit already used the token; count 0 means it lost the race.
    const { count: deleted } = await tx.verificationToken.deleteMany({ where });
    if (deleted === 0 || record.expires < new Date()) return false;

    // Only credentials users ever get a link; the password check guards against OAuth-only accounts.
    const { count } = await tx.user.updateMany({
      where: { email, password: { not: null } },
      data: { password: passwordHash },
    });
    if (count === 0) return false;

    // Opening the emailed link proves the user owns the address.
    await tx.user.updateMany({ where: { email, emailVerified: null }, data: { emailVerified: new Date() } });
    return true;
  });
}
