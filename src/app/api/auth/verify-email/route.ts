import { NextResponse, type NextRequest } from "next/server";

import { consumeVerificationToken } from "@/lib/auth/verification";
import { getAppUrl } from "@/lib/email/resend";
import { verifyEmailSchema } from "@/lib/validations/auth";

function redirectToSignIn(param: "verified" | "error", value: string) {
  const url = new URL("/sign-in", getAppUrl());
  url.searchParams.set(param, value);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const parsed = verifyEmailSchema.safeParse({
    email: request.nextUrl.searchParams.get("email"),
    token: request.nextUrl.searchParams.get("token"),
  });
  if (!parsed.success) return redirectToSignIn("error", "InvalidVerificationLink");

  try {
    const verified = await consumeVerificationToken(parsed.data.email, parsed.data.token);
    return verified
      ? redirectToSignIn("verified", "1")
      : redirectToSignIn("error", "InvalidVerificationLink");
  } catch (error) {
    console.error("Email verification failed", error);
    return redirectToSignIn("error", "InvalidVerificationLink");
  }
}
