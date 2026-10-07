"use client";

import Link from "next/link";
import { EmptyState, LoadState, Notice, Page, PageHeader, buttonClass, inputClass } from "@/components/ui";
import { formatQty, money, priceWithUnit } from "@/lib/format";
import { usePricedCart } from "@/lib/priced-cart";

export function CartScreen() {
  const { lines, total, ready, catalog, updateQuantity, removeItem } = usePricedCart();

  return (
    <Page>
      <PageHeader kicker="Cart" title="Cement to deliver" lede="Quantities stay in this browser until you place the order." />
      {!ready || catalog.loading ? (
        <p className="mt-10 text-muted" role="status">
          Loading the cart…
        </p>
      ) : catalog.error ? (
        <div className="mt-10">
          <LoadState loading={false} error={catalog.error} onRetry={catalog.reload} label="">
            <span />
          </LoadState>
        </div>
      ) : lines.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="The cart is empty"
            body="Add a product from the yard, then come back here to check out."
            href="/cement"
            action="Browse cement"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <li key={line.productId} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/cement/${line.productId}`} className="font-display text-3xl leading-none hover:text-clay">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{priceWithUnit(line.price, line.unitName)}</p>
                  </div>
                  <p className="font-display text-2xl tabular-nums">{money(line.lineTotal)}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="text-sm font-semibold">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={line.stockQuantity}
                      step={1}
                      value={line.quantity}
                      onChange={(event) => updateQuantity(line.productId, Number(event.target.value), line.stockQuantity)}
                      className={`${inputClass} ml-2 w-28`}
                      aria-label={`Quantity for ${line.name}`}
                    />
                  </label>
                  <button type="button" onClick={() => removeItem(line.productId)} className="text-sm font-semibold text-danger underline">
                    Remove
                  </button>
                </div>
                {line.missing || line.outOfStock ? (
                  <p className="mt-3 text-sm text-danger">This product is no longer available. Remove it before checkout.</p>
                ) : line.overStock ? (
                  <p className="mt-3 text-sm text-danger">
                    Only {formatQty(line.stockQuantity)} {line.unitName} remain. Lower the quantity.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    {formatQty(line.stockQuantity)} {line.unitName} in the yard
                  </p>
                )}
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-line bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Estimate</p>
            <p className="mt-2 font-display text-5xl tabular-nums">{money(total)}</p>
            <p className="mt-3 text-sm text-muted">The yard calculates the official total when the order is placed. Payment starts as unpaid.</p>
            <Link href="/checkout" className={`${buttonClass()} mt-6 w-full`}>
              Checkout
            </Link>
            <div className="mt-4">
              <Notice>You will be asked to sign in if you are not already.</Notice>
            </div>
          </aside>
        </div>
      )}
    </Page>
  );
}
