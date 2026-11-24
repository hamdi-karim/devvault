import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { AccountActions } from "@/components/profile/AccountActions";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { requireUserId } from "@/lib/auth/session";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats, getSystemItemTypes } from "@/lib/db/items";
import { getProfileUser } from "@/lib/db/users";

export const metadata: Metadata = {
  title: "Profile · DevVault",
};

export default async function ProfilePage() {
  const userId = await requireUserId();
  const [user, itemStats, collectionStats, itemTypes] = await Promise.all([
    getProfileUser(userId),
    getItemStats(userId),
    getCollectionStats(userId),
    getSystemItemTypes(userId),
  ]);
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account details and usage.</p>
      </div>

      <ProfileInfo user={user} />

      <DashboardSection title="Usage">
        <ProfileStats
          items={itemStats.items}
          collections={collectionStats.collections}
          itemTypes={itemTypes}
        />
      </DashboardSection>

      <DashboardSection title="Account">
        <AccountActions hasPassword={user.hasPassword} />
      </DashboardSection>
    </div>
  );
}
