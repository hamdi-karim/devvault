import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signInSchema } from "@/lib/validations/auth";
import authConfig from "./auth.config";

// Real Credentials provider (Node runtime only): replaces the edge-safe placeholder from auth.config.ts.
const credentialsProvider = Credentials({
  credentials: { email: {}, password: {} },
  async authorize(credentials) {
    const parsed = signInSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });
    // OAuth-only users have no password and can't sign in with credentials.
    if (!user?.password) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return { id: user.id, name: user.name, email: user.email, image: user.image };
  },
});

const providers = [
  ...authConfig.providers.filter((p) => !(typeof p === "object" && p.id === "credentials")),
  credentialsProvider,
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      return session;
    },
  },
});
