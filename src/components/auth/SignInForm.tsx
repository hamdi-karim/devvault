"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { GitHubIcon } from "@/components/auth/GitHubIcon";
import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";
import { Button } from "@/components/ui/button";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import { EMAIL_NOT_VERIFIED_CODE } from "@/lib/constants/auth";
import { signInSchema } from "@/lib/validations/auth";
import { type FieldErrors, zodFieldErrors } from "@/lib/validations/form";

type SignInField = "email" | "password";
type Pending = "credentials" | "github" | null;

export type RegisteredStatus = "email-sent" | "email-failed";

interface SignInFormProps {
  callbackUrl?: string;
  registered?: RegisteredStatus;
  verified?: boolean;
  error?: string;
}

const OAUTH_ERROR = "Could not sign in with GitHub. Please try again.";
const CREDENTIALS_ERROR = "Invalid email or password.";
const INVALID_LINK_ERROR = "This verification link is invalid or has expired. Sign in to request a new one.";

// Errors arriving via the `error` query param: our verify route, otherwise the GitHub OAuth flow.
function initialError(error?: string): string | null {
  if (!error) return null;
  return error === "InvalidVerificationLink" ? INVALID_LINK_ERROR : OAUTH_ERROR;
}

export function SignInForm({ callbackUrl, registered, verified, error }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignInField>>({});
  const [formError, setFormError] = useState<string | null>(initialError(error));
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  const disabled = pending !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setUnverifiedEmail(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors<SignInField>(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending("credentials");

    // Explicit redirectTo: signIn() reads `error` from the returned URL, which otherwise defaults to the
    // current page and would misreport success when this page has `?error=...` (e.g. an expired link).
    const redirectTo = safeCallbackUrl(callbackUrl, window.location.origin);
    const result = await signIn("credentials", { ...parsed.data, redirect: false, redirectTo });
    if (result?.error) {
      if (result.code === EMAIL_NOT_VERIFIED_CODE) setUnverifiedEmail(parsed.data.email);
      else setFormError(CREDENTIALS_ERROR);
      setPending(null);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  function handleGitHub() {
    setFormError(null);
    setUnverifiedEmail(null);
    setPending("github");
    // Navigates away; the pending state stays until the OAuth redirect happens.
    void signIn("github", {
      redirectTo: safeCallbackUrl(callbackUrl, window.location.origin),
    });
  }

  return (
    <div className="grid gap-5">
      {registered === "email-sent" && !formError && !unverifiedEmail && (
        <FormAlert variant="success">Account created. Check your email for a verification link.</FormAlert>
      )}
      {registered === "email-failed" && !formError && !unverifiedEmail && (
        <FormAlert variant="error">
          Account created, but we couldn&apos;t send the verification email. Sign in to request a new link.
        </FormAlert>
      )}
      {verified && !formError && !unverifiedEmail && (
        <FormAlert variant="success">Email verified. You can sign in now.</FormAlert>
      )}
      {formError && <FormAlert variant="error">{formError}</FormAlert>}
      {unverifiedEmail && (
        <FormAlert variant="error">
          <span className="grid gap-1">
            Please verify your email before signing in.
            <ResendVerificationButton key={unverifiedEmail} email={unverifiedEmail} />
          </span>
        </FormAlert>
      )}

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
