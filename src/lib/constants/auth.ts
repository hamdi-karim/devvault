export const BCRYPT_ROUNDS = 12;

export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
// Minimum time between two emailed links (verification or password reset) for the same address.
export const EMAIL_RESEND_COOLDOWN_MS = 60 * 1000;
// CredentialsSignin code returned to the client when an email/password user hasn't verified yet.
export const EMAIL_NOT_VERIFIED_CODE = "email_not_verified";
