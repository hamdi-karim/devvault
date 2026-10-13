export const SYSTEM_ITEM_TYPES = [
  { slug: "snippets", name: "Snippet", icon: "Code",       color: "#3b82f6", contentType: "TEXT", proOnly: false },
  { slug: "prompts",  name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6", contentType: "TEXT", proOnly: false },
  { slug: "commands", name: "Command", icon: "Terminal",   color: "#f97316", contentType: "TEXT", proOnly: false },
  { slug: "notes",    name: "Note",    icon: "StickyNote", color: "#fde047", contentType: "TEXT", proOnly: false },
  { slug: "links",    name: "Link",    icon: "Link",       color: "#10b981", contentType: "URL",  proOnly: false },
  { slug: "files",    name: "File",    icon: "File",       color: "#6b7280", contentType: "FILE", proOnly: true  },
  { slug: "images",   name: "Image",   icon: "Image",      color: "#ec4899", contentType: "FILE", proOnly: true  },
] as const;
