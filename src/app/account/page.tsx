import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountScreen } from "@/components/auth/AccountScreen";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading account…</p>}>
      <AccountScreen />
    </Suspense>
  );
}
