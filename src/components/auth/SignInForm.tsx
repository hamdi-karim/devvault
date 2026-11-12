"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { GitHubIcon } from "@/components/auth/GitHubIcon";
import { Button } from "@/components/ui/button";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import { signInSchema } from "@/lib/validations/auth";
import { type FieldErrors, zodFieldErrors } from "@/lib/validations/form";

type SignInField = "email" | "password";
type Pending = "credentials" | "github" | null;

interface SignInFormProps {
  callbackUrl?: string;
  registered?: boolean;
  error?: string;
}

const OAUTH_ERROR = "Could not sign in with GitHub. Please try again.";
const CREDENTIALS_ERROR = "Invalid email or password.";

export function SignInForm({ callbackUrl, registered, error }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignInField>>({});
  const [formError, setFormError] = useState<string | null>(error ? OAUTH_ERROR : null);
  const [pending, setPending] = useState<Pending>(null);

  const disabled = pending !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors<SignInField>(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending("credentials");

    const result = await signIn("credentials", { ...parsed.data, redirect: false });
    if (result?.error) {
      setFormError(CREDENTIALS_ERROR);
      setPending(null);
      return;
    }

    const redirectTo = safeCallbackUrl(callbackUrl, window.location.origin);
    router.push(redirectTo);
    router.refresh();
  }

  function handleGitHub() {
    setFormError(null);
    setPending("github");
    // Navigates away; the pending state stays until the OAuth redirect happens.
    void signIn("github", {
      redirectTo: safeCallbackUrl(callbackUrl, window.location.origin),
    });
  }

  return (
    <div className="grid gap-5">
      {registered && !formError && (
        <FormAlert variant="success">Account created. Sign in to continue.</FormAlert>
      )}
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={disabled}
        onClick={handleGitHub}
      >
        {pending === "github" ? (
          <>
            <Loader2 className="animate-spin" />
            Redirecting to GitHub…
          </>
        ) : (
          <>
            <GitHubIcon className="size-4" />
            Continue with GitHub
          </>
        )}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          disabled={disabled}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          disabled={disabled}
        />
        <Button type="submit" size="lg" className="w-full" disabled={disabled}>
          {pending === "credentials" && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
