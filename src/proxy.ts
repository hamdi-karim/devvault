import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

// Separate instance without the Prisma adapter so the proxy stays edge-compatible.
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  if (req.auth) return;

  const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
