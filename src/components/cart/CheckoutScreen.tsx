"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Alert, Notice, Page, PageHeader, buttonClass, inputClass } from "@/components/ui";
import { api } from "@/lib/api";
import { formatQty, money } from "@/lib/format";
import { usePricedCart } from "@/lib/priced-cart";
import type { CementOrder } from "@/lib/types";

export function CheckoutScreen() {
  return (
    <RequireAuth>
      <CheckoutForm />
    </RequireAuth>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { lines, total, blocked, clear, catalog, ready } = usePricedCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function place(event: FormEvent) {
    event.preventDefault();
    if (blocked) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await api<CementOrder>("/api/cement/orders", {
        method: "POST",
        body: JSON.stringify({
          deliveryAddress: address.trim(),
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        }),
      });
      clear();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The order could not be placed.");
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <PageHeader
        kicker="Checkout"
        title="Where should it go?"
        lede="The order starts as pending and unpaid. You cannot set the price."
      />

      {!ready || catalog.loading ? (
        <p className="mt-10 text-muted" role="status">
          Checking stock…
        </p>
      ) : lines.length === 0 ? (
        <div className="mt-10">
          <Notice>
            The cart is empty.{" "}
            <Link href="/cement" className="font-semibold underline">
              Browse cement
            </Link>
          </Notice>
        </div>
      ) : (
        <form onSubmit={place} className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Delivery address</span>
              <textarea
                required
                maxLength={300}
                rows={4}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="12 Galle Road, Colombo"
                className={inputClass}
              />
            </label>
            {catalog.error ? <Alert>{catalog.error}</Alert> : null}
            {lines.some((line) => line.missing || line.outOfStock || line.overStock) ? (
              <Alert>Fix the cart before placing the order. A line is missing, out of stock, or over the yard quantity.</Alert>
            ) : null}
            {error ? <Alert>{error}</Alert> : null}
            <button type="submit" className={buttonClass()} disabled={submitting || blocked}>
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
          <aside className="h-fit border border-line bg-card p-5">
            <h2 className="font-display text-3xl">Order</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((line) => (
                <li key={line.productId} className="flex justify-between gap-3 text-sm">
                  <span>
                    {line.name}
                    <span className="block text-muted">
                      {formatQty(line.quantity)} {line.unitName}
                    </span>
                  </span>
                  <span className="tabular-nums">{money(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-4 font-display text-4xl tabular-nums">{money(total)}</p>
            <p className="mt-2 text-sm text-muted">Estimate only, until the yard confirms the total.</p>
          </aside>
        </form>
      )}
    </Page>
  );
}
