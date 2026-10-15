import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";

const RECENT_COLLECTIONS_LIMIT = 5;

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const [cookieStore, itemTypes, collections] = await Promise.all([
    cookies(),
    getSystemItemTypes(),
    getSidebarCollections(RECENT_COLLECTIONS_LIMIT),
  ]);
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar itemTypes={itemTypes} collections={collections} />
      <SidebarInset className="h-dvh min-w-0">
        <TopBar />
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
