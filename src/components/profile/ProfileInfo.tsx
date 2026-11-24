import { UserAvatar } from "@/components/layout/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileUser } from "@/lib/db/users";
import { formatDate } from "@/lib/format";

interface ProfileInfoProps {
  user: ProfileUser;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <UserAvatar
          name={user.name ?? user.email}
          image={user.image}
          className="size-14 text-base"
        />
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{user.name ?? "Unnamed user"}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">Member since {formatDate(user.createdAt)}</p>
        </div>
        <Badge variant={user.isPro ? "default" : "secondary"} className="ml-auto">
          {user.isPro ? "Pro" : "Free"}
        </Badge>
      </CardContent>
    </Card>
  );
}
