import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex h-dvh flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r p-4 md:block">
          <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
