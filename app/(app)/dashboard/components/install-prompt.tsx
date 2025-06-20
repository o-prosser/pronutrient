"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { setInstallPromptAction } from "../actions";

export function InstallPrompt() {
  const [, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <>
      <Dialog
        defaultOpen
        onOpenChange={async () => {
          await setInstallPromptAction();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install app</DialogTitle>
            <DialogDescription>
              To install this app on your iOS device, tap the share button
              <span role="img" aria-label="share icon">
                {" "}
                ⎋{" "}
              </span>
              and then "Add to Home Screen"
              <span role="img" aria-label="plus icon">
                {" "}
                ➕{" "}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
