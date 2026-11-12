import Link from "next/link";
import { Vault } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Vault className="size-4" />
        </span>
        DevVault
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
