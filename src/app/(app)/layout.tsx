import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUserId } from "@/lib/auth/session";
import { SIDEBAR_COOKIE_NAME } from "@/lib/constants/sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getCurrentUser } from "@/lib/db/users";

const RECENT_COLLECTIONS_LIMIT = 5;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const userId = await requireUserId();
  const [cookieStore, user, itemTypes, collections] = await Promise.all([
    cookies(),
    getCurrentUser(userId),
    getSystemItemTypes(userId),
    getSidebarCollections(userId, RECENT_COLLECTIONS_LIMIT),
  ]);
  // A valid JWT for a user that no longer exists: send them back to sign in.
  if (!user) redirect("/sign-in");

  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} itemTypes={itemTypes} collections={collections} />
      <SidebarInset className="h-dvh min-w-0">
        <TopBar />
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
