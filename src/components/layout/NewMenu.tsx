"use client";

import { ChevronDown, FilePlus, FolderPlus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NewMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="lg"
            aria-label="New"
            className="ml-auto rounded-xl bg-linear-to-r from-blue-500 to-violet-500 px-2.5 text-white shadow-sm shadow-violet-500/20 hover:brightness-110 sm:gap-2 sm:px-4"
          />
        }
      >
        <Plus />
        <span className="hidden sm:inline">New</span>
        <ChevronDown className="hidden transition-transform duration-200 group-data-popup-open/button:rotate-180 sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-48 p-1.5">
        <DropdownMenuItem className="gap-2.5 px-2 py-1.5">
          <FilePlus className="text-blue-500" />
          New item
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2.5 px-2 py-1.5">
          <FolderPlus className="text-violet-500" />
          New collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
