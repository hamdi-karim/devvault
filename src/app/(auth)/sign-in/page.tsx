import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in · DevVault",
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; registered?: string; error?: string }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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
          registered={first(params.registered) === "1"}
          error={first(params.error)}
        />
      </CardContent>
    </Card>
  );
}
