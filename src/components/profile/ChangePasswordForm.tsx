"use client";

import { unstable_rethrow } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { type ChangePasswordField, changePasswordAction } from "@/actions/account";
import { FormAlert } from "@/components/auth/FormAlert";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/lib/validations/auth";
import { type FieldErrors, zodFieldErrors } from "@/lib/validations/form";

interface ChangePasswordFormProps {
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  onSuccess: () => void;
}

const FIELDS: { name: ChangePasswordField; label: string; autoComplete: string }[] = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "password", label: "New password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
];

const EMPTY_VALUES: Record<ChangePasswordField, string> = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function ChangePasswordForm({ pending, onPendingChange, onSuccess }: ChangePasswordFormProps) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ChangePasswordField>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors<ChangePasswordField>(parsed.error));
      return;
    }
    setFieldErrors({});
    onPendingChange(true);

    try {
      const result = await changePasswordAction(parsed.data);
      if (result.success) onSuccess();
      else if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      else setFormError(result.error ?? GENERIC_ERROR);
    } catch (error) {
      // Let Next handle the redirect to sign-in when the session has expired.
      unstable_rethrow(error);
      setFormError(GENERIC_ERROR);
    } finally {
      onPendingChange(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {formError && <FormAlert variant="error">{formError}</FormAlert>}
      {FIELDS.map(({ name, label, autoComplete }) => (
        <FormField
          key={name}
          name={name}
          label={label}
          type="password"
          autoComplete={autoComplete}
          value={values[name]}
          onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))}
          error={fieldErrors[name]}
          disabled={pending}
        />
      ))}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Update password
      </Button>
    </form>
  );
}
