# Topbar New Button Spec

## Overview

Restyle the "New" button in the top bar and turn it into a dropdown menu with "New item" and "New collection" options, matching the screenshot.

## Requirements

- Button: `Plus` icon + "New" label + chevron, with a blue → purple gradient background (snippet `#3b82f6` → prompt `#8b5cf6`) and a subtle hover state
- Clicking opens a dropdown aligned to the button's right edge; the chevron flips while open
- Menu items:
  - "New item" with a blue `FilePlus` icon
  - "New collection" with a purple `FolderPlus` icon
- Closes on outside click, Escape, or selecting an item; keyboard navigable
- Use the shadcn `DropdownMenu` component (add it via the shadcn CLI)
- Put the menu in its own client component (`src/components/layout/NewMenu.tsx`); `TopBar` stays a server component
- On mobile, collapse the button to the `+` icon only

## Out of scope

- The menu items don't open anything yet; the item drawer and collection form are separate features

## References

- @context/screenshots/topbar-add-new-button.png
- @src/components/layout/TopBar.tsx
