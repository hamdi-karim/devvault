"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Star, Vault } from "lucide-react";

import { UserMenu } from "@/components/layout/UserMenu";
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
import type { DashboardCollection, SidebarCollections } from "@/lib/db/collections";
import type { SidebarItemType } from "@/lib/db/items";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import type { CurrentUser } from "@/lib/db/users";
import { typeColorVar } from "@/lib/type-color";

interface AppSidebarProps {
  user: CurrentUser;
  itemTypes: SidebarItemType[];
  collections: SidebarCollections;
}

export function AppSidebar({ user, itemTypes, collections }: AppSidebarProps) {
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
        <TypesGroup itemTypes={itemTypes} isPro={user.isPro} />
        <CollectionsGroup label="Favorite collections" collections={collections.favorites} />
        <CollectionsGroup label="Recent collections" collections={collections.recents} />
        <ViewAllCollections />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

interface TypesGroupProps {
  itemTypes: SidebarItemType[];
  isPro: boolean;
}

function TypesGroup({ itemTypes, isPro }: TypesGroupProps) {
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
            const isLocked = type.proOnly && !isPro;

            return (
              <SidebarMenuItem key={type.id}>
                <SidebarMenuButton
                  render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  isActive={pathname === href}
                  tooltip={`${type.name}s`}
                >
                  <Icon className="text-(--type-color)" style={typeColorVar(type.color)} />
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
  collections: DashboardCollection[];
}

function CollectionsGroup({ label, collections }: CollectionsGroupProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  if (collections.length === 0) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {collections.map((collection) => {
            const href = `/collections/${collection.id}`;

            return (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton
                  render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  isActive={pathname === href}
                >
                  {collection.isFavorite ? (
                    <Star className="fill-yellow-400 text-yellow-400" />
                  ) : (
                    <span
                      className="size-2 shrink-0 rounded-full bg-(--type-color)"
                      style={typeColorVar(collection.color)}
                    />
                  )}
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

function ViewAllCollections() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="pt-0 group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href="/collections" onClick={() => setOpenMobile(false)} />}
            isActive={pathname === "/collections"}
            className="text-muted-foreground"
          >
            <span>View all collections</span>
            <ArrowRight className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
