"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { type FieldErrors, zodFieldErrors } from "@/lib/validations/form";

type ResetField = "password" | "confirmPassword";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

interface ResetResponse {
  success: boolean;
  error: string | null;
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ResetField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = resetPasswordSchema.safeParse({ email, token, password, confirmPassword });
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors<ResetField>(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as ResetResponse;
      if (response.ok && body.success) {
        router.push("/sign-in?reset=1");
        return;
      }
      setFormError(body.error ?? GENERIC_ERROR);
    } catch {
      setFormError(GENERIC_ERROR);
    }
    setPending(false);
  }

  return (
    <div className="grid gap-5">
      {formError && (
        <FormAlert variant="error">
          {formError}{" "}
          <Link href="/forgot-password" className="underline underline-offset-4">
            Request a new link
          </Link>
        </FormAlert>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <FormField
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          disabled={pending}
        />
        <FormField
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          disabled={pending}
        />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
