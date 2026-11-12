import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

// Edge-compatible config (no database adapter), shared by the proxy and src/auth.ts.
export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
