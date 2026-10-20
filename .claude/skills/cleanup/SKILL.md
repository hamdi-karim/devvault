---
name: cleanup
description: Clean up project housekeeping tasks (add "run" to execute fixes)
argument-hint: run|check
---

Review the codebase for cleanup tasks:

1. Make sure that the history in @context/current-feature.md is in order from oldest to newest
2. Find unnecessary console.log statements in src/
3. Find unused imports
4. Check for stale TODO comments
5. Find orphaned/unused files
6. Check that context files match actual project state
7. Check if the .env.production has the same variables (not always the same value) as the .env. If something is missing, tell me.
8. Find `@ts-ignore` comments that might be stale

## Output format

Markdown can't color text, so use colored emoji to show status. Report every check in this order, one numbered item each, starting with its status icon:

| Icon | Meaning |
|---|---|
| 🟢 | Clean, nothing to do |
| 🟡 | Optional or low priority (safe to leave as is; say why) |
| 🟠 | Should fix (stale docs, unused code, mismatched config) |
| 🔴 | Must fix (missing env variable, broken reference, likely bug) |

Item format:

```
1. 🟢 **History order:** already oldest to newest.
5. 🟠 **Unused mock data:** [src/lib/mock-data.ts](src/lib/mock-data.ts) only `currentUser` is used.
   🔧 **Fix:** trim the file to `MockUser` + `currentUser`.
```

- Put a short bold label after the icon, then a one-line finding.
- Link files as markdown links so they're clickable.
- For 🟡/🟠/🔴 items, add an indented `🔧 **Fix:**` line with the proposed change. Use sub-bullets (a, b, c) when one check has several findings.
- End with a one-line summary count, e.g. `🟢 6 · 🟡 1 · 🟠 2 · 🔴 0`, then list the fixable item numbers.
- When reporting changes after a fix, use ✅ for each item changed, ⏭️ for skipped and ❌ for failed (with the reason).

**Mode: $ARGUMENTS**

If no argument or argument is "check":

- Only report findings, don't modify anything
- List what WOULD be cleaned up

If the argument is "run" or "fix":

- First, report all findings with numbered items
- Then ask: "Which items would you like me to fix? (enter numbers like 1,3,5 or 'all' or 'none')"
- Wait for user response before making any changes
- Only fix the items the user specifies
- Report what you changed
