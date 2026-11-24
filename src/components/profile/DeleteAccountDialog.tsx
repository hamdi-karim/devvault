"use client";

import { unstable_rethrow } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteAccountAction } from "@/actions/account";
import { FormAlert } from "@/components/auth/FormAlert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setError(null);
    setOpen(next);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        // Redirects to the sign-in page on success, so a result means it failed.
        const result = await deleteAccountAction();
        setError(result.error ?? GENERIC_ERROR);
      } catch (error) {
        // Let Next handle the redirect; anything else is a failed request.
        unstable_rethrow(error);
        setError(GENERIC_ERROR);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            Your account and all of your items, collections and tags will be permanently deleted. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <FormAlert variant="error">{error}</FormAlert>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
