import type { ReactNode } from "react";

import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Card } from "@/components/ui/card";

interface ActionRowProps {
  title: string;
  description: string;
  children: ReactNode;
}

function ActionRow({ title, description, children }: ActionRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface AccountActionsProps {
  hasPassword: boolean;
}

export function AccountActions({ hasPassword }: AccountActionsProps) {
  return (
    <Card className="gap-4 px-4">
      {hasPassword && (
        <ActionRow title="Password" description="Change the password you sign in with.">
          <ChangePasswordDialog />
        </ActionRow>
      )}
      <ActionRow title="Delete account" description="Permanently delete your account and all of your content.">
        <DeleteAccountDialog />
      </ActionRow>
    </Card>
  );
}
