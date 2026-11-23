import { NextResponse } from "next/server";

import { resetPassword } from "@/lib/auth/password-reset";
import { resetPasswordSchema } from "@/lib/validations/auth";

const INVALID_LINK = "This reset link is invalid or has expired. Request a new one.";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, data: null, error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // A malformed email or token means the link itself is bad, not the user's input.
    const linkProblem = issue?.path[0] === "email" || issue?.path[0] === "token";
    return errorResponse(linkProblem ? INVALID_LINK : (issue?.message ?? "Invalid input"), 400);
  }

  const { email, token, password } = parsed.data;
  try {
    const updated = await resetPassword(email, token, password);
    if (!updated) return errorResponse(INVALID_LINK, 400);
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error) {
    console.error("Password reset failed", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
