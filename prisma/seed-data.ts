export const DEMO_USER = {
  email: "demo@devvault.io",
  name: "Demo User",
  password: "12345678",
} as const;

type SeedTypeSlug = "snippets" | "prompts" | "commands" | "links";

export interface SeedItem {
  type: SeedTypeSlug;
  title: string;
  description: string;
  content?: string;
  language?: string;
  url?: string;
}

export interface SeedCollection {
  name: string;
  description: string;
  items: SeedItem[];
}

export const DEMO_COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        type: "snippets",
        title: "useDebounce & useLocalStorage hooks",
        description: "Debounce a changing value and persist state to localStorage",
        language: "typescript",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "snippets",
        title: "Context provider + compound components",
        description: "Typed context with a safe hook and a compound Tabs component",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.* must be used inside <Tabs>");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        type: "snippets",
        title: "cn, formatBytes & sleep utilities",
        description: "Small helpers used across most React projects",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return \`\${(bytes / 1024 ** i).toFixed(decimals)} \${units[i]}\`;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        type: "prompts",
        title: "Code review",
        description: "Thorough review focused on bugs, security and readability",
        content: `You are a senior engineer reviewing a pull request.

Review the code below and report, in order of severity:
1. Bugs and logic errors (include the input that triggers them)
2. Security issues (auth, input validation, injection, secrets)
3. Performance problems (N+1 queries, unnecessary re-renders, heavy loops)
4. Readability and naming

For each finding give the line, the problem, and a concrete fix.
Skip style nitpicks a linter would catch. If the code is good, say so briefly.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        type: "prompts",
        title: "Generate documentation",
        description: "Write README-style docs for a module or function",
        content: `Write documentation for the following code.

Include:
- A one-paragraph overview of what it does and when to use it
- Parameters and return values (with types)
- At least two usage examples
- Edge cases, errors thrown and known limitations

Write for a developer who is new to this codebase. Use Markdown, keep it concise, and don't invent behavior that isn't in the code.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        type: "prompts",
        title: "Refactoring assistant",
        description: "Refactor code without changing behavior",
        content: `Refactor the code below to improve readability and maintainability.

Rules:
- Do not change external behavior or public APIs
- Prefer small, well-named functions and early returns
- Remove duplication and dead code
- Keep the existing language, framework and style conventions

First list the refactorings you plan to make and why, then output the full refactored code.

\`\`\`
{{code}}
\`\`\``,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        type: "snippets",
        title: "Next.js multi-stage Dockerfile",
        description: "Small production image using Next.js standalone output",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "commands",
        title: "Deploy with migrations",
        description: "Apply pending Prisma migrations, build and restart the app",
        language: "bash",
        content: `#!/usr/bin/env bash
set -euo pipefail

git pull --ff-only
npm ci
npx prisma migrate deploy
npm run build
pm2 reload devvault --update-env`,
      },
      {
        type: "links",
        title: "Docker documentation",
        description: "Official Docker docs: guides, reference and Dockerfile syntax",
        url: "https://docs.docker.com/",
      },
      {
        type: "links",
        title: "GitHub Actions documentation",
        description: "Workflows, runners and CI/CD with GitHub Actions",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        type: "commands",
        title: "Undo last commit (keep changes)",
        description: "Move HEAD back one commit and keep the changes staged",
        language: "bash",
        content: "git reset --soft HEAD~1",
      },
      {
        type: "commands",
        title: "Clean up Docker",
        description: "Remove stopped containers, unused images, networks and build cache",
        language: "bash",
        content: "docker system prune -af --volumes",
      },
      {
        type: "commands",
        title: "Kill process on a port",
        description: "Find and kill whatever is listening on port 3000",
        language: "bash",
        content: "lsof -ti tcp:3000 | xargs kill -9",
      },
      {
        type: "commands",
        title: "Check outdated packages",
        description: "List outdated npm dependencies and update within semver ranges",
        language: "bash",
        content: "npm outdated && npm update",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        type: "links",
        title: "Tailwind CSS docs",
        description: "Utility classes and v4 theme configuration reference",
        url: "https://tailwindcss.com/docs",
      },
      {
        type: "links",
        title: "shadcn/ui",
        description: "Accessible, copy-paste React components built on Tailwind",
        url: "https://ui.shadcn.com",
      },
      {
        type: "links",
        title: "Material Design 3",
        description: "Google's open-source design system and guidelines",
        url: "https://m3.material.io",
      },
      {
        type: "links",
        title: "Lucide icons",
        description: "Open-source icon library used across DevVault",
        url: "https://lucide.dev/icons",
      },
    ],
  },
];
