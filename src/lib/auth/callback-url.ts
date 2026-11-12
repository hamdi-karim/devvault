const DEFAULT_CALLBACK_URL = "/dashboard";

// Only allow same-origin relative paths so the sign-in page can't be used as an open redirect.
export function safeCallbackUrl(value: string | undefined, origin?: string): string {
  if (!value) return DEFAULT_CALLBACK_URL;

  // The proxy sets an absolute callbackUrl; reduce it to a path when it matches this origin.
  if (origin && value.startsWith(`${origin}/`)) value = value.slice(origin.length);

  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) return value;

  return DEFAULT_CALLBACK_URL;
}
