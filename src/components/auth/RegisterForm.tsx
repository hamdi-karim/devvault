"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/validations/auth";
import { type FieldErrors, zodFieldErrors } from "@/lib/validations/form";

type RegisterField = "name" | "email" | "password" | "confirmPassword";
type RegisterValues = Record<RegisterField, string>;

interface RegisterResponse {
  success: boolean;
  data: { emailSent: boolean; verificationRequired: boolean } | null;
  error: string | null;
}

// Banner to show on /sign-in: no verification needed, link sent, or the email failed.
function registeredParam(data: RegisterResponse["data"]): string {
  if (data?.verificationRequired === false) return "created";
  return data?.emailSent ? "1" : "email-failed";
}

const EMPTY_VALUES: RegisterValues = { name: "", email: "", password: "", confirmPassword: "" };
const GENERIC_ERROR = "Something went wrong. Please try again.";

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(field: RegisterField) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors<RegisterField>(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as RegisterResponse;

      if (response.status === 201 && body.success) {
        router.push(`/sign-in?registered=${registeredParam(body.data)}`);
        return;
      }

      const message = body.error ?? GENERIC_ERROR;
      // 409: the email is taken, so show it next to the email field.
      if (response.status === 409) setFieldErrors({ email: message });
      else setFormError(message);
    } catch {
      setFormError(GENERIC_ERROR);
    }
    setPending(false);
  }

  return (
    <div className="grid gap-5">
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <FormField
          name="name"
          label="Name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={values.name}
          onChange={update("name")}
          error={fieldErrors.name}
          disabled={pending}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={update("email")}
          error={fieldErrors.email}
          disabled={pending}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={update("password")}
          error={fieldErrors.password}
          disabled={pending}
        />
        <FormField
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={update("confirmPassword")}
          error={fieldErrors.confirmPassword}
          disabled={pending}
        />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
