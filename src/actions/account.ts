"use server";

import { signOut } from "@/auth";
import { changePassword } from "@/lib/auth/change-password";
import { requireUserId } from "@/lib/auth/session";
import { deleteUser } from "@/lib/db/users";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { changePasswordSchema } from "@/lib/validations/auth";
import { zodFieldErrors } from "@/lib/validations/form";
import type { ActionResult } from "@/types/action";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export type ChangePasswordField = "currentPassword" | "password" | "confirmPassword";

export async function changePasswordAction(input: unknown): Promise<ActionResult<ChangePasswordField>> {
  const userId = await requireUserId();

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = zodFieldErrors<ChangePasswordField>(parsed.error);
    return { success: false, data: null, error: "Invalid input", fieldErrors };
  }

  const limit = await checkRateLimit("changePassword", userId);
  if (!limit.success) return { success: false, data: null, error: rateLimitMessage(limit.reset) };

  try {
    const result = await changePassword(userId, parsed.data.currentPassword, parsed.data.password);
    if (result === "ok") return { success: true, data: null, error: null };
    if (result === "no-password") {
      return { success: false, data: null, error: "This account has no password to change." };
    }

    const error = "Current password is incorrect";
    return { success: false, data: null, error, fieldErrors: { currentPassword: error } };
  } catch (error) {
    console.error("Password change failed", error);
    return { success: false, data: null, error: GENERIC_ERROR };
  }
}

// Only returns on failure: on success the user is signed out and redirected.
export async function deleteAccountAction(): Promise<ActionResult> {
  const userId = await requireUserId();

  try {
    await deleteUser(userId);
  } catch (error) {
    console.error("Account deletion failed", error);
    return { success: false, data: null, error: GENERIC_ERROR };
  }

  // Outside the try: signOut throws Next's redirect.
  return signOut({ redirectTo: "/sign-in" });
}
