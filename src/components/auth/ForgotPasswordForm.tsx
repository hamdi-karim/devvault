"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@/lib/validations/auth";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    setPending(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (response.ok) {
        setSent(true);
      } else {
        const body = (await response.json().catch(() => null)) as { error?: string | null } | null;
        setSent(false);
        setFormError(body?.error ?? GENERIC_ERROR);
      }
    } catch {
      setFormError(GENERIC_ERROR);
    }
    setPending(false);
  }

  return (
    <div className="grid gap-5">
      {sent && (
        <FormAlert variant="success">
          If an account exists for that email, we&apos;ve sent a link to reset your password. It expires in 1 hour.
        </FormAlert>
      )}
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldError}
          disabled={pending}
        />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {sent ? "Send another link" : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
