import { createHash, randomBytes } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

type Client = typeof db | Prisma.TransactionClient;

// Only the hash is stored, so a database leak doesn't expose usable links.
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function newToken(): string {
  return randomBytes(32).toString("hex");
}

function tokenRow(identifier: string, token: string, ttlMs: number) {
  return { identifier, token: hashToken(token), expires: new Date(Date.now() + ttlMs) };
}

// Replaces any earlier token for this identifier, so only the newest link works.
export async function createToken(identifier: string, ttlMs: number): Promise<string> {
  const token = newToken();

  await db.$transaction([
    db.verificationToken.deleteMany({ where: { identifier } }),
    db.verificationToken.create({ data: tokenRow(identifier, token, ttlMs) }),
  ]);

  return token;
}

// Creation time is derived from `expires`, so no extra column is needed for the cooldown.
export async function canIssueToken(
  identifier: string,
  ttlMs: number,
  cooldownMs: number,
  client: Client = db,
): Promise<boolean> {
  const latest = await client.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
    select: { expires: true },
  });
  if (!latest) return true;

  const createdAt = latest.expires.getTime() - ttlMs;
  return Date.now() - createdAt >= cooldownMs;
}

// Cooldown check and token creation in one transaction, serialized per identifier by an advisory
// lock, so concurrent requests (e.g. a double submit) can't both pass the check and send two links.
// Returns null while the cooldown is active.
export async function createTokenWithCooldown(
  identifier: string,
  ttlMs: number,
  cooldownMs: number,
): Promise<string | null> {
  const token = newToken();

  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${identifier}))`;
    if (!(await canIssueToken(identifier, ttlMs, cooldownMs, tx))) return null;

    await tx.verificationToken.deleteMany({ where: { identifier } });
    await tx.verificationToken.create({ data: tokenRow(identifier, token, ttlMs) });
    return token;
  });
}
