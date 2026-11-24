"use client";

import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [changed, setChanged] = useState(false);

  function handleOpenChange(next: boolean) {
    if (pending) return;
    if (next) setChanged(false);
    setOpen(next);
  }

  function handleSuccess() {
    setChanged(true);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button variant="outline" />}>Change password</DialogTrigger>
        <DialogContent showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Enter your current password, then choose a new one.</DialogDescription>
          </DialogHeader>
          {/* Unmounts with the dialog, so the fields are empty each time it opens. */}
          <ChangePasswordForm pending={pending} onPendingChange={setPending} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
      {changed && (
        <div className="w-full">
          <FormAlert variant="success">Password updated.</FormAlert>
        </div>
      )}
    </>
  );
}
