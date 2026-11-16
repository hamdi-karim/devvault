"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface ResendVerificationButtonProps {
  email: string;
}

type Status = "idle" | "pending" | "sent" | "error";

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("pending");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
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
      {status === "error" && <span className="block">Could not send the email. Please try again.</span>}
    </span>
  );
}
