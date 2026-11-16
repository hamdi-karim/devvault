import { after, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { BCRYPT_ROUNDS } from "@/lib/constants/auth";
import { issueVerificationEmail } from "@/lib/auth/verification";
import { registerSchema } from "@/lib/validations/auth";

const EMAIL_TAKEN = "An account with this email already exists";

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

    // Sent after the response so a slow or unreachable email API doesn't hold up the form.
    // A failed send is logged, not fatal: the user can request a new link from the sign-in page.
    after(() =>
      issueVerificationEmail(user.email).catch((error: unknown) =>
        console.error("Failed to issue verification email", error),
      ),
    );

    return NextResponse.json({ success: true, data: user, error: null }, { status: 201 });
  } catch (error) {
    // A concurrent registration can still hit the unique email constraint.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse(EMAIL_TAKEN, 409);
    }
    console.error("Registration failed", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
