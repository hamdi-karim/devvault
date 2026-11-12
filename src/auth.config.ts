import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// Edge-compatible config (no database adapter), shared by the proxy and src/auth.ts.
// The Credentials provider is a placeholder here; src/auth.ts overrides it with bcrypt validation.
export default {
  pages: { signIn: "/sign-in" },
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
