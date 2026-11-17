import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { BCRYPT_ROUNDS } from "@/lib/constants/auth";
import { isEmailVerificationEnabled } from "@/lib/auth/email-verification";
import { issueVerificationEmail } from "@/lib/auth/verification";
import { registerSchema } from "@/lib/validations/auth";

const EMAIL_TAKEN = "An account with this email already exists";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, data: null, error }, { status });
}

// Awaited so the UI can tell the user when the email didn't go out. A failed send isn't fatal:
// the account exists and a new link can be requested from the sign-in page.
function sendVerificationEmail(email: string): Promise<boolean> {
  return issueVerificationEmail(email).catch((error: unknown) => {
    console.error("Failed to issue verification email", error);
    return false;
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return errorResponse(EMAIL_TAKEN, 409);

    const user = await db.user.create({
      data: { name, email, password: await bcrypt.hash(password, BCRYPT_ROUNDS) },
      select: { id: true, name: true, email: true },
    });

    const verificationRequired = isEmailVerificationEnabled();
    const emailSent = verificationRequired ? await sendVerificationEmail(user.email) : false;

    return NextResponse.json(
      { success: true, data: { ...user, emailSent, verificationRequired }, error: null },
      { status: 201 },
    );
  } catch (error) {
    // A concurrent registration can still hit the unique email constraint.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse(EMAIL_TAKEN, 409);
    }
    console.error("Registration failed", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
