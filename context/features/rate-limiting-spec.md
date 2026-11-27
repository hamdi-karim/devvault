# Rate Limiting for Auth

## Overview

Implement rate limiting on authentication endpoints to prevent brute force attacks, credential stuffing, and abuse of email-sending endpoints.

## Requirements

- Add rate limiting to auth-related API routes
- Use Upstash Redis with `@upstash/ratelimit` for serverless-compatible limiting
- Create reusable rate limiting utility
- Return appropriate error responses (429 Too Many Requests)
- Display user-friendly error messages on the frontend

## Endpoints to Protect

| Endpoint | Limit | Window | Key By |
|----------|-------|--------|--------|
| `/api/auth/callback/credentials` (login) | 5 attempts | 15 min | IP + email |
| `/api/auth/callback/credentials` (login) | 20 attempts | 15 min | IP |
| `/api/auth/register` | 3 attempts | 1 hour | IP |
| `/api/auth/forgot-password` | 3 attempts | 1 hour | IP |
| `/api/auth/reset-password` | 5 attempts | 15 min | IP |
| `/api/auth/resend-verification` | 3 attempts | 15 min | IP + email |
| `changePassword` Server Action (`src/actions/account.ts`) | 5 attempts | 15 min | User ID |

Login has two limits and both must pass:

- **IP + email** stops brute force against one account.
- **IP only** (looser) stops credential stuffing, where one IP tries leaked passwords across many different emails. Each email would be a fresh key under the IP + email limit alone.

`changePassword` asks for the current password, so anyone with an open session could otherwise guess it without limit. It is keyed by user ID, since the user is already authenticated.

## Implementation

- Create `src/lib/rate-limit.ts` utility with Upstash client
- Use sliding window algorithm for smooth limiting
- Extract IP from `x-forwarded-for` header (Vercel) or request
- Combine IP + identifier (email) where applicable for tighter limits
- Return `{ success, remaining, reset }` from rate limit checks
- Login: check both limits inside the Credentials provider's `authorize()` in `src/auth.ts`, before the database lookup and bcrypt compare. When blocked, throw a `CredentialsSignin` subclass with code `rate_limited`, following the existing `EmailNotVerifiedError` pattern. `SignInForm` reads the code and shows the rate-limit message. No custom sign-in handler is needed.
- `changePassword`: check the limit before verifying the current password and return the standard `{ success: false, error }` action result when blocked.

## Environment Variables

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Error Handling

- API returns 429 status with JSON: `{ error: "Too many attempts. Please try again in X minutes." }`
- Frontend displays the error inline with the existing `FormAlert` component, matching how the auth and profile forms already show errors
- Include `Retry-After` header in 429 responses
- Login and `changePassword` don't return a 429: login surfaces the `rate_limited` error code through Auth.js, and `changePassword` returns an action error. Both show the same "try again in X minutes" message.

## Notes

- Upstash free tier: 500K commands/month, 250 MB storage, 10 GB bandwidth. Each limit check costs a few commands, which is plenty for auth limiting. The default in-memory `ephemeralCache` also skips Redis calls for clients that are already blocked.
- The database is `devvault` on AWS `eu-central-1` (Frankfurt), the same region as Neon. Production and Preview share it, so keys are prefixed per environment (`VERCEL_ENV`, falling back to `development`) so that preview and local traffic don't count against production limits.
- Rate limiting should fail open (allow request) if Upstash is unavailable
- Consider adding rate limiting middleware for cleaner implementation later
