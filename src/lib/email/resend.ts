import { Resend } from "resend";

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "DevVault <onboarding@resend.dev>";

let client: Resend | null = null;

// Lazy so a missing key only fails when an email is actually sent, not at import (e.g. during build).
export function getResend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Emailed links must come from config, never the request Host header (which can be spoofed).
export function getAppUrl(): string {
  const url = process.env.APP_URL;
  if (!url) throw new Error("APP_URL is not set");
  return url.replace(/\/+$/, "");
}
