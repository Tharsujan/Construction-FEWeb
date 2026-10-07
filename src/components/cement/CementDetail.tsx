"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ProductImage } from "@/components/cement/ProductImage";
import { Missing, Page, buttonClass, inputClass } from "@/components/ui";
import { useCart } from "@/lib/cart";
import { formatQty, priceWithUnit } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { CementProduct } from "@/lib/types";

export function CementDetail({ id }: { id: string }) {
  const { data, error, status, loading, reload } = useResource<CementProduct>(`/api/cement/products/${id}`, false);
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading cement…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This cement is not in the yard"
        body="It may be inactive, or the link is out of date."
        href="/cement"
        action="Back to cement"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger" role="alert">
          {error ?? "Could not load this product."}
        </p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  const inCart = items.find((item) => item.productId === data.id);
  const inStock = data.stockQuantity > 0;

  function add(event: FormEvent) {
    event.preventDefault();
    const amount = Number(quantity);
    const result = addItem(data!, amount);
    if (result) {
      setFormError(result);
      setNote(null);
      return;
    }
    setFormError(null);
    setNote("Added to cart");
  }

  return (
    <Page>
      <Link href="/cement" className="text-sm font-semibold text-clay hover:underline">
        All cement
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <ProductImage imageUrl={data.imageUrl} name={data.name} />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-clay">{data.unitName}</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.95]">{data.name}</h1>
          <p className="mt-6 font-display text-5xl tabular-nums">{priceWithUnit(data.price, data.unitName)}</p>
        </div>

        <aside className="border border-line bg-card p-5">
          <h2 className="font-display text-3xl">Add to the cart</h2>
          {inStock ? (
            <form onSubmit={add} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Quantity</span>
                <input
                  type="number"
                  min={1}
                  max={data.stockQuantity}
                  step={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className={inputClass}
                  required
                />
              </label>
              <button type="submit" className={`${buttonClass()} w-full`}>
                Add to cart
              </button>
              {note ? <p className="text-sm text-moss">{note}</p> : null}
              {formError ? (
                <p className="text-sm text-danger" role="alert">
                  {formError}
                </p>
              ) : null}
              {inCart ? (
                <p className="text-sm text-muted">
                  Cart has {formatQty(inCart.quantity)} {data.unitName}.{" "}
                  <Link href="/cart" className="font-semibold text-clay hover:underline">
                    Review cart
                  </Link>
                </p>
              ) : null}
            </form>
          ) : (
            <p className="mt-4 text-muted">This product is out of stock, so it cannot be added to the cart.</p>
          )}
        </aside>
      </div>
    </Page>
  );
}
