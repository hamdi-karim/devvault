// Mock data for the dashboard UI. Replace with Prisma queries once the database is set up.

export type ContentType = "TEXT" | "URL" | "FILE";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  contentType: ContentType;
  proOnly: boolean;
  itemCount: number;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  typeCounts: Partial<Record<string, number>>;
}

export interface MockItem {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
  language: string | null;
  url: string | null;
  typeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: string;
  createdAt: string;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "Karim Hamdi",
  email: "karim@devvault.dev",
  image: null,
  isPro: false,
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", slug: "snippets", name: "Snippet", icon: "Code", color: "#3b82f6", contentType: "TEXT", proOnly: false, itemCount: 42 },
  { id: "type_prompt", slug: "prompts", name: "Prompt", icon: "Sparkles", color: "#8b5cf6", contentType: "TEXT", proOnly: false, itemCount: 18 },
  { id: "type_command", slug: "commands", name: "Command", icon: "Terminal", color: "#f97316", contentType: "TEXT", proOnly: false, itemCount: 9 },
  { id: "type_note", slug: "notes", name: "Note", icon: "StickyNote", color: "#fde047", contentType: "TEXT", proOnly: false, itemCount: 23 },
  { id: "type_link", slug: "links", name: "Link", icon: "Link", color: "#10b981", contentType: "URL", proOnly: false, itemCount: 31 },
  { id: "type_file", slug: "files", name: "File", icon: "File", color: "#6b7280", contentType: "FILE", proOnly: true, itemCount: 0 },
  { id: "type_image", slug: "images", name: "Image", icon: "Image", color: "#ec4899", contentType: "FILE", proOnly: true, itemCount: 0 },
];

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Hooks, memoization, and state shapes worth keeping.",
    isFavorite: true,
    itemCount: 18,
    typeCounts: { snippets: 12, prompts: 3, links: 3 },
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "Project briefs and system prompts for the assistant.",
    isFavorite: false,
    itemCount: 11,
    typeCounts: { files: 9, prompts: 2 },
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Data transforms and CLI one-liners that stick.",
    isFavorite: false,
    itemCount: 15,
    typeCounts: { commands: 9, snippets: 6 },
  },
  {
    id: "col_prompts",
    name: "Prompt Library",
    description: "System prompts and personas that ship.",
    isFavorite: false,
    itemCount: 21,
    typeCounts: { prompts: 16, notes: 5 },
  },
];

export const items: MockItem[] = [
  {
    id: "item_1",
    title: "useFetch hook",
    description: "Generic data-fetching hook with loading and error state.",
    contentType: "TEXT",
    content: "const { data, loading } = useFetch<T>(url)",
    language: "typescript",
    url: null,
    typeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["react", "hooks", "fetch"],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-10-12T09:58:00Z",
    createdAt: "2026-09-02T10:00:00Z",
  },
  {
    id: "item_2",
    title: "Refactor the auth flow",
    description: null,
    contentType: "TEXT",
    content: "Split token refresh into its own module and drop the duplicated guard.",
    language: null,
    url: null,
    typeId: "type_note",
    collectionIds: [],
    tags: ["auth", "planning"],
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-10-12T09:00:00Z",
    createdAt: "2026-10-01T14:20:00Z",
  },
  {
    id: "item_3",
    title: "git undo last commit",
    description: "Keep changes staged, drop the commit.",
    contentType: "TEXT",
    content: "git reset --soft HEAD~1",
    language: "bash",
    url: null,
    typeId: "type_command",
    collectionIds: ["col_python"],
    tags: ["git"],
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-10-12T07:00:00Z",
    createdAt: "2026-08-15T08:30:00Z",
  },
  {
    id: "item_4",
    title: "Code review assistant",
    description: null,
    contentType: "TEXT",
    content: "You are a senior reviewer. Flag correctness and clarity issues, then suggest minimal edits.",
    language: null,
    url: null,
    typeId: "type_prompt",
    collectionIds: ["col_prompts", "col_context"],
    tags: ["review", "system-prompt"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-10-11T10:00:00Z",
    createdAt: "2026-07-20T12:00:00Z",
  },
  {
    id: "item_5",
    title: "React docs: useMemo",
    description: "When memoization actually helps.",
    contentType: "URL",
    content: null,
    language: null,
    url: "https://react.dev/reference/react/useMemo",
    typeId: "type_link",
    collectionIds: ["col_react"],
    tags: ["react", "performance"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-10T16:45:00Z",
    createdAt: "2026-06-11T09:10:00Z",
  },
  {
    id: "item_6",
    title: "Group by key",
    description: "Group a list of dicts by a field.",
    contentType: "TEXT",
    content: "from itertools import groupby\ngrouped = {k: list(v) for k, v in groupby(sorted(rows, key=key), key=key)}",
    language: "python",
    url: null,
    typeId: "type_snippet",
    collectionIds: ["col_python"],
    tags: ["python", "data"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-09T11:30:00Z",
    createdAt: "2026-05-28T17:00:00Z",
  },
];
