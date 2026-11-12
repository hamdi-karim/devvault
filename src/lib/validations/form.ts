import type { ZodError } from "zod";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

// First Zod issue message per top-level field, keyed by field name.
export function zodFieldErrors<T extends string>(error: ZodError): FieldErrors<T> {
  const errors: FieldErrors<T> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as T] = issue.message;
    }
  }

  return errors;
}
