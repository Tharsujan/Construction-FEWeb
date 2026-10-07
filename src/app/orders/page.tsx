import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersScreen } from "@/components/orders/OrdersScreen";

export const metadata: Metadata = { title: "My orders" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading orders…</p>}>
      <OrdersScreen />
    </Suspense>
  );
}
