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

// e.g. "1 item", "3 items".
export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
