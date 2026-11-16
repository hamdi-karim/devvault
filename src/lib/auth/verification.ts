import { createHash, randomBytes } from "node:crypto";

import { db } from "@/lib/db";
import { VERIFICATION_RESEND_COOLDOWN_MS, VERIFICATION_TOKEN_TTL_MS } from "@/lib/constants/auth";
import { getAppUrl } from "@/lib/email/resend";
import { sendVerificationEmail } from "@/lib/email/verification-email";

// Only the hash is stored, so a database leak doesn't expose usable links.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Replaces any earlier token for this email, so only the newest link works.
export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");

  await db.$transaction([
    db.verificationToken.deleteMany({ where: { identifier: email } }),
    db.verificationToken.create({
      data: {
        identifier: email,
        token: hashToken(token),
        expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
      },
    }),
  ]);

  return token;
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

// Creation time is derived from `expires`, so no extra column is needed for the cooldown.
export async function canResendVerification(email: string): Promise<boolean> {
  const latest = await db.verificationToken.findFirst({
    where: { identifier: email },
    orderBy: { expires: "desc" },
    select: { expires: true },
  });
  if (!latest) return true;

  const createdAt = latest.expires.getTime() - VERIFICATION_TOKEN_TTL_MS;
  return Date.now() - createdAt >= VERIFICATION_RESEND_COOLDOWN_MS;
}
