import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserAvatar } from "@/components/layout/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserId } from "@/lib/auth/session";
import { getCurrentUser } from "@/lib/db/users";

export const metadata: Metadata = {
  title: "Profile · DevVault",
};

export default async function ProfilePage() {
  const userId = await requireUserId();
  const user = await getCurrentUser(userId);
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account details.</p>
      </div>

      <Card className="max-w-md">
        <CardContent className="flex items-center gap-4">
          <UserAvatar name={user.name} image={user.image} size="lg" className="size-14 text-base" />
          <div className="min-w-0">
            <p className="truncate text-base font-medium">{user.name ?? "Unnamed user"}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.isPro ? "default" : "secondary"} className="ml-auto">
            {user.isPro ? "Pro" : "Free"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
