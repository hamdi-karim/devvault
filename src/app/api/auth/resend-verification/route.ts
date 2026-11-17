import { after, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isEmailVerificationEnabled } from "@/lib/auth/email-verification";
import { canResendVerification, issueVerificationEmail } from "@/lib/auth/verification";
import { resendVerificationSchema } from "@/lib/validations/auth";

// Same response whether or not an email was sent, so this can't be used to discover accounts.
const OK = { success: true, data: null, error: null };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = resendVerificationSchema.safeParse(body);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ success: false, data: null, error }, { status: 400 });
  }

  const { email } = parsed.data;
  // All work runs after the response, so response time doesn't reveal whether an email was sent.
  after(() => resendIfNeeded(email));
  return NextResponse.json(OK);
}

async function resendIfNeeded(email: string) {
  if (!isEmailVerificationEnabled()) return;
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { password: true, emailVerified: true },
    });
    // Only unverified credentials users get a link; OAuth-only users have no password.
    if (user?.password && !user.emailVerified && (await canResendVerification(email))) {
      await issueVerificationEmail(email);
    }
  } catch (error) {
    console.error("Resend verification failed", error);
  }
}
