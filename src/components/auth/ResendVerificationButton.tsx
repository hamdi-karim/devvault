"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface ResendVerificationButtonProps {
  email: string;
}

type Status = "idle" | "pending" | "sent" | "error";

const SEND_ERROR = "Could not send the email. Please try again.";

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState(SEND_ERROR);

  async function handleClick() {
    setStatus("pending");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      // A 429 carries a "try again in X minutes" message.
      const body = (await response.json().catch(() => null)) as { error?: string | null } | null;
      setErrorMessage(response.status === 429 && body?.error ? body.error : SEND_ERROR);
      setStatus("error");
    } catch {
      setErrorMessage(SEND_ERROR);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <span className="block">If your account needs verifying, we&apos;ve sent a new link. Check your inbox.</span>;
  }

  return (
    <span className="grid gap-1">
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto justify-start p-0 text-inherit underline"
        disabled={status === "pending"}
        onClick={handleClick}
      >
        {status === "pending" && <Loader2 className="animate-spin" />}
        Resend verification email
      </Button>
      {status === "error" && <span className="block">{errorMessage}</span>}
    </span>
  );
}
