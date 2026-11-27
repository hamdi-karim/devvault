import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { pluralize } from "@/lib/format";

type Window = Parameters<typeof Ratelimit.slidingWindow>[1];

export const RATE_LIMITS = {
  signInEmail: { limit: 5, window: "15 m" },
  signInIp: { limit: 20, window: "15 m" },
  register: { limit: 3, window: "1 h" },
  forgotPassword: { limit: 3, window: "1 h" },
  resetPassword: { limit: 5, window: "15 m" },
  resendVerification: { limit: 3, window: "15 m" },
  changePassword: { limit: 5, window: "15 m" },
} as const satisfies Record<string, { limit: number; window: Window }>;

export type RateLimitName = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  // Unix ms when the limit resets; 0 when no limit was applied.
  reset: number;
}

// Preview and local dev share the production Upstash database, so keys are namespaced per environment.
const KEY_PREFIX = `devvault:${process.env.VERCEL_ENV ?? "development"}:rl`;

// Module scope so each limiter's in-memory cache of blocked keys survives while the function is warm.
const limiters = new Map<RateLimitName, Ratelimit>();
let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  if (!redis) console.warn("[rate-limit] Upstash env vars missing, rate limiting is disabled");
  return redis;
}

function getLimiter(name: RateLimitName): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;

  let limiter = limiters.get(name);
  if (!limiter) {
    const { limit, window } = RATE_LIMITS[name];
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `${KEY_PREFIX}:${name}`,
      // Fail open quickly if Upstash is slow, rather than blocking sign-in.
      timeout: 1000,
      analytics: false,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

// Fails open: missing config or an Upstash error lets the request through.
export async function checkRateLimit(name: RateLimitName, key: string): Promise<RateLimitResult> {
  const allowed = { success: true, remaining: RATE_LIMITS[name].limit, reset: 0 };
  const limiter = getLimiter(name);
  if (!limiter) return allowed;

  try {
    const { success, remaining, reset } = await limiter.limit(key);
    return { success, remaining, reset };
  } catch (error) {
    console.error(`[rate-limit] ${name} check failed, allowing request`, error);
    return allowed;
  }
}

// On Vercel these headers are set by the platform, so clients can't spoof them.
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

// Hashed so plaintext emails never land in Redis.
export function emailKey(ip: string, email: string): string {
  const emailHash = createHash("sha256").update(email.toLowerCase()).digest("hex");
  return `${ip}:${emailHash}`;
}

export function retryAfterSeconds(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

export function rateLimitMessage(reset: number): string {
  const minutes = Math.ceil(retryAfterSeconds(reset) / 60);
  return `Too many attempts. Please try again in ${pluralize(minutes, "minute")}.`;
}

export function rateLimitResponse(result: RateLimitResult) {
  return NextResponse.json(
    { success: false, data: null, error: rateLimitMessage(result.reset) },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds(result.reset)) } },
  );
}
