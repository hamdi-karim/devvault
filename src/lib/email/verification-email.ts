import { EMAIL_FROM, getResend } from "@/lib/email/resend";

const SUBJECT = "Verify your DevVault email";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(url: string): string {
  const href = escapeHtml(url);
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">Verify your email</h1>
  <p style="margin:0 0 24px;line-height:1.5">Thanks for signing up for DevVault. Click the button below to verify your email address. This link expires in 24 hours.</p>
  <a href="${href}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Verify email</a>
  <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.5">Or paste this link into your browser:<br><a href="${href}" style="color:#3b82f6;word-break:break-all">${href}</a></p>
  <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't create an account, you can ignore this email.</p>
</div>`;
}

function buildText(url: string): string {
  return `Verify your DevVault email\n\nOpen this link to verify your email address (expires in 24 hours):\n${url}\n\nIf you didn't create an account, you can ignore this email.`;
}

// Returns false instead of throwing: callers treat a failed send as recoverable (the user can resend).
export async function sendVerificationEmail(email: string, url: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[dev] Verification link for ${email}: ${url}`);
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
      console.error("Failed to send verification email", error.name, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send verification email", error);
    return false;
  }
}
