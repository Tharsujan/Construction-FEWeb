import type { Metadata } from "next";
import { Suspense } from "react";
import { CartScreen } from "@/components/cart/CartScreen";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading the cart…</p>}>
      <CartScreen />
    </Suspense>
  );
}
