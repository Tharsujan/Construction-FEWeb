import type { Metadata } from "next";
import { Suspense } from "react";
import { CementDetail } from "@/components/cement/CementDetail";

export const metadata: Metadata = { title: "Cement" };

export default function CementProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading cement…</p>}>
      <Product params={params} />
    </Suspense>
  );
}

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CementDetail id={id} />;
}
