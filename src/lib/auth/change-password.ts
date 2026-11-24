import bcrypt from "bcryptjs";

import { resetIdentifier } from "@/lib/auth/tokens";
import { BCRYPT_ROUNDS } from "@/lib/constants/auth";
import { db } from "@/lib/db";

export type ChangePasswordResult = "ok" | "no-password" | "wrong-password";

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, password: true },
  });
  // OAuth-only users (or a deleted account) have no password to change.
  if (!user?.password) return "no-password";

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return "wrong-password";

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  // Pending reset links are dropped so an older one can't undo the change.
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { password: passwordHash } }),
    db.verificationToken.deleteMany({ where: { identifier: resetIdentifier(user.email) } }),
  ]);
  return "ok";
}
