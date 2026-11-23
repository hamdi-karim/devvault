import { escapeHtml } from "@/lib/email/html";
import { EMAIL_FROM, getResend } from "@/lib/email/resend";

const SUBJECT = "Reset your DevVault password";

function buildHtml(url: string): string {
  const href = escapeHtml(url);
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">Reset your password</h1>
  <p style="margin:0 0 24px;line-height:1.5">We received a request to reset your DevVault password. Click the button below to choose a new one. This link expires in 1 hour and can only be used once.</p>
  <a href="${href}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Reset password</a>
  <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.5">Or paste this link into your browser:<br><a href="${href}" style="color:#3b82f6;word-break:break-all">${href}</a></p>
  <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't request a password reset, you can ignore this email. Your password won't change.</p>
</div>`;
}

function buildText(url: string): string {
  return `Reset your DevVault password\n\nOpen this link to choose a new password (expires in 1 hour, single use):\n${url}\n\nIf you didn't request a password reset, you can ignore this email.`;
}

// Returns false instead of throwing: the user can request another link.
export async function sendPasswordResetEmail(email: string, url: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[dev] Password reset link for ${email}: ${url}`);
  }

  try {
    const { error } = await getResend().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: SUBJECT,
      html: buildHtml(url),
      text: buildText(url),
    });
    if (error) {
      console.error("Failed to send password reset email", error.name, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send password reset email", error);
    return false;
  }
}
