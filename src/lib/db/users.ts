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
