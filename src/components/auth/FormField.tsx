import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends Omit<React.ComponentProps<"input">, "id" | "name"> {
  name: string;
  label: string;
  error?: string;
  // Optional element shown on the label row, e.g. a "Forgot password?" link.
  labelAction?: React.ReactNode;
}

// Labelled input with an inline error message, wired up for screen readers.
export function FormField({ name, label, error, labelAction, ...props }: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      {labelAction ? (
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={name}>{label}</Label>
          {labelAction}
        </div>
      ) : (
        <Label htmlFor={name}>{label}</Label>
      )}
      <Input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
