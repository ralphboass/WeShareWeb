"use client";

import { AlertTriangle } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";

/**
 * Shown only when the Firebase env vars are missing: the pages then render
 * sample rides instead of live data and sign-in/booking are unavailable.
 */
export function DemoModeBanner() {
  if (isFirebaseConfigured) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-yellow-100 px-4 py-2 text-center text-xs font-semibold text-yellow-900">
      <AlertTriangle className="size-3.5" />
      Demo mode — Firebase is not configured, so rides below are sample data and
      accounts are disabled.
    </div>
  );
}
