import { resetIdentifier } from "@/lib/auth/tokens";
import { db } from "@/lib/db";

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isPro: boolean;
}

export function getCurrentUser(userId: string): Promise<CurrentUser | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, isPro: true },
  });
}

export interface ProfileUser extends CurrentUser {
  createdAt: Date;
  // False for OAuth-only users.
  hasPassword: boolean;
}

export async function getProfileUser(userId: string): Promise<ProfileUser | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, isPro: true, createdAt: true, password: true },
  });
  if (!user) return null;

  // The hash never leaves this function.
  const { password, ...profile } = user;
  return { ...profile, hasPassword: password !== null };
}

// Deletes the user and all of their content.
export async function deleteUser(userId: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return;

  // Items go first: they reference item types with onDelete: Restrict, so cascading to the user's
  // custom types could fail. Verification tokens have no relation to User, so they go by email.
  await db.$transaction([
    db.item.deleteMany({ where: { userId } }),
    db.verificationToken.deleteMany({
      where: { identifier: { in: [user.email, resetIdentifier(user.email)] } },
    }),
    db.user.deleteMany({ where: { id: userId } }),
  ]);
}
