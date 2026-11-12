import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "cn";

interface FormAlertProps {
  variant: "error" | "success";
  children: React.ReactNode;
}

// Inline status banner above a form (no toasts yet).
export function FormAlert({ variant, children }: FormAlertProps) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        isError
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      )}
    >
      {isError ? (
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CircleCheck className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}
