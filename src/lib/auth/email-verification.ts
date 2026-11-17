// Server-only switch for the email verification requirement (EMAIL_VERIFICATION_ENABLED).
// Off only when explicitly "false", so a missing var keeps verification on.
export function isEmailVerificationEnabled(): boolean {
  return process.env.EMAIL_VERIFICATION_ENABLED !== "false";
}
