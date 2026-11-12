import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";

interface UserAvatarProps {
  name: string | null;
  image: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
}

// GitHub profile image when available, otherwise initials from the name.
// No "use client": it has no hooks, so it works in both server and client trees.
export function UserAvatar({ name, image, size = "default", className }: UserAvatarProps) {
  const label = name ?? "User";

  return (
    <Avatar size={size} className={className}>
      {image && <AvatarImage src={image} alt={label} />}
      <AvatarFallback className="rounded-[inherit] font-medium">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
