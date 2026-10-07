"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/cement/ProductImage";
import { buttonClass } from "@/components/ui";
import { useCart } from "@/lib/cart";
import { priceWithUnit } from "@/lib/format";
import type { CementProduct } from "@/lib/types";

export function CementCard({ product }: { product: CementProduct }) {
  const { addItem } = useCart();
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inStock = product.stockQuantity > 0;

  function add() {
    const result = addItem(product, 1);
    if (result) {
      setError(result);
      setNote(null);
      return;
    }
    setError(null);
    setNote("Added to cart");
  }

  return (
    <article className="flex h-full flex-col border border-line bg-card">
      <ProductImage imageUrl={product.imageUrl} name={product.name} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{product.unitName}</p>
        <h2 className="mt-2 font-display text-3xl leading-none">
          <Link href={`/cement/${product.id}`} className="hover:text-clay">
            {product.name}
          </Link>
        </h2>
        <p className="mt-6 font-display text-3xl tabular-nums">{priceWithUnit(product.price, product.unitName)}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/cement/${product.id}`} className={buttonClass("quiet")}>
            View
          </Link>
          {inStock ? (
            <button type="button" onClick={add} className={buttonClass()}>
              Add to cart
            </button>
          ) : (
            <p className="text-sm text-muted">Out of stock</p>
          )}
        </div>
        {note ? <p className="mt-3 text-sm text-moss">{note}</p> : null}
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </article>
  );
}
