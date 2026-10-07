import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutScreen } from "@/components/cart/CheckoutScreen";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Opening checkout…</p>}>
      <CheckoutScreen />
    </Suspense>
  );
}
