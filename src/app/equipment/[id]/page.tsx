import type { Metadata } from "next";
import { Suspense } from "react";
import { EquipmentDetail } from "@/components/equipment/EquipmentDetail";

export const metadata: Metadata = { title: "Equipment" };

export default function EquipmentItemPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading machine…</p>}>
      <Machine params={params} />
    </Suspense>
  );
}

async function Machine({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EquipmentDetail id={id} />;
}
