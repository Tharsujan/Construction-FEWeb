import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading order…</p>}>
      <Order params={params} />
    </Suspense>
  );
}

async function Order({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
