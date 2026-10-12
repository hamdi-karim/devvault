import type { CSSProperties } from "react";

// Exposes a type color as `--type-color` so Tailwind classes can use it.
export function typeColorVar(color: string): CSSProperties {
  return { "--type-color": color } as CSSProperties;
}
