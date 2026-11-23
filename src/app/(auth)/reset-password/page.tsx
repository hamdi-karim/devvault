import type { Metadata } from "next";
import Link from "next/link";

import { FormAlert } from "@/components/auth/FormAlert";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isPasswordResetTokenValid } from "@/lib/auth/password-reset";
import { resetLinkSchema } from "@/lib/validations/auth";

export const metadata: Metadata = {
  title: "Reset password · DevVault",
  // The URL carries the reset token, so never send it to other origins in the Referer header.
  referrer: "no-referrer",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string | string[]; token?: string | string[] }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Checks the link without consuming it; the token is only used up when the new password is saved.
async function validLink(params: Awaited<ResetPasswordPageProps["searchParams"]>) {
  const parsed = resetLinkSchema.safeParse({ email: first(params.email), token: first(params.token) });
  if (!parsed.success) return null;
  try {
    return (await isPasswordResetTokenValid(parsed.data.email, parsed.data.token)) ? parsed.data : null;
  } catch (error) {
    console.error("Password reset link check failed", error);
    return null;
  }
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const link = await validLink(await searchParams);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Choose a new password</CardTitle>
        <CardDescription>{link ? `For ${link.email}` : "This link can't be used."}</CardDescription>
      </CardHeader>
      <CardContent>
        {link ? (
          <ResetPasswordForm email={link.email} token={link.token} />
        ) : (
          <div className="grid gap-5">
            <FormAlert variant="error">This reset link is invalid or has expired.</FormAlert>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/forgot-password" className="font-medium text-foreground underline-offset-4 hover:underline">
                Request a new link
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
