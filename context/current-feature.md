# Current Feature

**Dashboard UI Phase 2**: Build out the dashboard sidebar (phase 2 of 3), using mock data imported directly from `src/lib/mock-data.ts` until the database is implemented.

## Feature Status

In progress

## Goals

- Collapsible sidebar
- Items/types with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close the sidebar
- Always a drawer on mobile view

## Notes

- Spec: @context/features/dashboard-phase-2-spec.md
- Reference screenshot: @context/screenshots/dashboard-main-ui.png
- Data: @src/lib/mock-data.ts (import directly for now)
- Related specs: @context/features/dashboard-phase-1-spec.md, @context/features/dashboard-phase-3-spec.md
- Overview: @context/project-overview.md

## History

<!-- Keep this updated, Earliest to Latest -->

- **Next.js project setup** (Completed): Initialized Next.js 16 + React 19 + TypeScript (strict) with Tailwind CSS v4 and ESLint (flat config, `eslint-config-next`).
- **Dashboard UI Phase 1** (Completed): Initialized shadcn/ui (`base-nova` style, Button/Input/Kbd), dark mode by default, `/dashboard` route with layout shell, display-only top bar (search + New button), and Sidebar/Main placeholders.
