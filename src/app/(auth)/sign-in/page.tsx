import type { Metadata } from "next";

import { type RegisteredStatus, SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in · DevVault",
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; registered?: string; verified?: string; error?: string }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function registeredStatus(value: string | undefined): RegisteredStatus | undefined {
  if (value === "1") return "email-sent";
  if (value === "email-failed") return "email-failed";
  return undefined;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your vault.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm
          callbackUrl={first(params.callbackUrl)}
          registered={registeredStatus(first(params.registered))}
          verified={first(params.verified) === "1"}
          error={first(params.error)}
        />
      </CardContent>
    </Card>
  );
}
