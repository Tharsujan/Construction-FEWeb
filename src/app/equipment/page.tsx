import type { Metadata } from "next";
import { Suspense } from "react";
import { EquipmentCatalog } from "@/components/equipment/EquipmentCatalog";

export const metadata: Metadata = { title: "Equipment" };

export default function EquipmentPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading equipment…</p>}>
      <EquipmentCatalog />
    </Suspense>
  );
}
