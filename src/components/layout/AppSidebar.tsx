"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vault } from "lucide-react";
import type { CSSProperties } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getCollectionColor, getRecentCollections } from "@/lib/collections";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import {
  collections,
  currentUser,
  itemTypes,
  items,
  type MockCollection,
} from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

const favoriteCollections = collections.filter((collection) => collection.isFavorite);
const recentCollections = getRecentCollections(
  collections.filter((collection) => !collection.isFavorite),
  items,
).slice(0, RECENT_COLLECTIONS_LIMIT);

function colorVar(color: string) {
  return { "--type-color": color } as CSSProperties;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />} tooltip="DevVault">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Vault />
              </span>
              <span className="text-base font-semibold">DevVault</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <TypesGroup />
        <CollectionsGroup label="Favorite collections" collections={favoriteCollections} />
        <CollectionsGroup label="Recent collections" collections={recentCollections} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function TypesGroup() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Types</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {itemTypes.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            const href = `/items/${type.slug}`;
            const isLocked = type.proOnly && !currentUser.isPro;

            return (
              <SidebarMenuItem key={type.id}>
                <SidebarMenuButton
                  render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  isActive={pathname === href}
                  tooltip={`${type.name}s`}
                >
                  <Icon className="text-(--type-color)" style={colorVar(type.color)} />
                  <span>{type.name}s</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  {isLocked ? (
                    <span className="rounded border px-1 text-[10px] font-semibold tracking-wide">
                      PRO
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{type.itemCount}</span>
                  )}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

interface CollectionsGroupProps {
  label: string;
  collections: MockCollection[];
}

function CollectionsGroup({ label, collections: groupCollections }: CollectionsGroupProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  if (groupCollections.length === 0) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {groupCollections.map((collection) => {
            const href = `/collections/${collection.id}`;

            return (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton
                  render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  isActive={pathname === href}
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-(--type-color)"
                    style={colorVar(getCollectionColor(collection, itemTypes))}
                  />
                  <span>{collection.name}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge className="text-muted-foreground">
                  {collection.itemCount}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function UserMenu() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip={currentUser.name}>
          <Avatar className="rounded-lg after:rounded-lg">
            {currentUser.image && <AvatarImage src={currentUser.image} alt={currentUser.name} />}
            <AvatarFallback className="rounded-lg">{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <span className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate font-medium">{currentUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
