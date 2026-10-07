"use client";

import { roundMoney } from "./format";
import { useCart } from "./cart";
import { useResource } from "./use-resource";
import type { CementProduct } from "./types";

export function usePricedCart() {
  const cart = useCart();
  const catalog = useResource<CementProduct[]>("/api/cement/products", false);

  const lines = cart.items.map((item) => {
    const product = catalog.data?.find((entry) => entry.id === item.productId);
    const known = catalog.data != null;
    const missing = known && !product;
    const stock = product?.stockQuantity ?? item.stockQuantity;
    const price = product?.price ?? item.price;
    return {
      ...item,
      name: product?.name ?? item.name,
      imageUrl: product?.imageUrl ?? item.imageUrl,
      unitName: product?.unitName ?? item.unitName,
      price,
      stockQuantity: stock,
      missing,
      outOfStock: known && (missing || stock <= 0),
      overStock: known && !missing && item.quantity - stock > 0.0001,
      lineTotal: roundMoney(price * item.quantity),
    };
  });

  const total = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const blocked =
    !cart.ready ||
    catalog.loading ||
    Boolean(catalog.error) ||
    lines.length === 0 ||
    lines.some((line) => line.missing || line.outOfStock || line.overStock);

  return { ...cart, lines, total, blocked, catalog };
}
