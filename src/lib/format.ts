const UNITS = [
  { label: "d", ms: 86_400_000 },
  { label: "h", ms: 3_600_000 },
  { label: "m", ms: 60_000 },
] as const;

// Compact relative time, e.g. "2m", "3h", "1d".
export function formatRelativeTime(date: string, now: number = Date.now()): string {
  const elapsed = Math.max(0, now - Date.parse(date));

  for (const unit of UNITS) {
    if (elapsed >= unit.ms) return `${Math.floor(elapsed / unit.ms)}${unit.label}`;
  }

  return "now";
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

// e.g. "November 24, 2026".
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

// Up to two initials from a display name, e.g. "Brad Traversy" → "BT"; "?" when empty.
export function getInitials(name: string | null | undefined): string {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "?";
}

// e.g. "1 item", "3 items".
export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
