import { after, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { issuePasswordResetEmail } from "@/lib/auth/password-reset";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// Same response whether or not an email was sent, so this can't be used to discover accounts.
const OK = { success: true, data: null, error: null };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ success: false, data: null, error }, { status: 400 });
  }

  const limit = await checkRateLimit("forgotPassword", getClientIp(request.headers));
  if (!limit.success) return rateLimitResponse(limit);

  const { email } = parsed.data;
  // All work runs after the response, so response time doesn't reveal whether an email was sent.
  after(() => sendResetIfNeeded(email));
  return NextResponse.json(OK);
}

async function sendResetIfNeeded(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email }, select: { password: true } });
    // OAuth-only users have no password to reset. The cooldown is enforced inside issuePasswordResetEmail.
    if (user?.password) await issuePasswordResetEmail(email);
  } catch (error) {
    console.error("Password reset request failed", error);
  }
}
