import type { Metadata } from "next";
import { Suspense } from "react";
import { CementCatalog } from "@/components/cement/CementCatalog";

export const metadata: Metadata = { title: "Cement" };

export default function CementPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading cement…</p>}>
      <CementCatalog />
    </Suspense>
  );
}
