import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  meta?: string;
  children: ReactNode;
}

export function DashboardSection({ title, meta, children }: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
      </div>
      {children}
    </section>
  );
}
