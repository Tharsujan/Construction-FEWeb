"use client";

import { useCallback, useSyncExternalStore } from "react";
import { formatQty, roundQty } from "./format";
import type { CartItem, CementProduct } from "./types";

const CART_KEY = "siteworks.cart";
const EMPTY: CartItem[] = [];

let snapshot: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Array<CartItem & { unit?: string }>;
    if (Array.isArray(parsed)) {
      snapshot = parsed.map((item) => ({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl ?? "",
        unitName: item.unitName || item.unit || "",
        price: item.price,
        stockQuantity: item.stockQuantity,
        quantity: item.quantity,
      }));
    }
  } catch {
    localStorage.removeItem(CART_KEY);
  }
}

function getSnapshot() {
  ensureLoaded();
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

function write(next: CartItem[]) {
  snapshot = next;
  localStorage.setItem(CART_KEY, JSON.stringify(next));
  emit();
}

function subscribeHydration() {
  return () => {};
}

export function useCart() {
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((product: CementProduct, quantity: number) => {
    if (product.stockQuantity <= 0) return "This product is out of stock.";
    const add = roundQty(quantity);
    if (!Number.isFinite(add) || add <= 0) return "Enter a quantity greater than zero.";

    const current = getSnapshot();
    const existing = current.find((item) => item.productId === product.id);
    const nextQty = roundQty((existing?.quantity ?? 0) + add);
    if (nextQty - product.stockQuantity > 0.0001) {
      const left = roundQty(product.stockQuantity - (existing?.quantity ?? 0));
      return left <= 0
        ? "Your cart already has all the stock for this product."
        : `Only ${formatQty(left)} more can be added.`;
    }

    const nextItem: CartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      unitName: product.unitName,
      price: product.price,
      stockQuantity: product.stockQuantity,
      quantity: nextQty,
    };

    write(existing ? current.map((item) => (item.productId === product.id ? nextItem : item)) : [...current, nextItem]);
    return null;
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, maxStock?: number) => {
    const next = roundQty(quantity);
    const current = getSnapshot();
    write(
      current.flatMap((item) => {
        if (item.productId !== productId) return [item];
        if (!Number.isFinite(next) || next <= 0) return [];
        const cap = maxStock ?? item.stockQuantity;
        return [{ ...item, quantity: Math.min(next, cap), stockQuantity: cap }];
      }),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    write(getSnapshot().filter((item) => item.productId !== productId));
  }, []);

  const clear = useCallback(() => write([]), []);

  return {
    items,
    ready: hydrated,
    count: items.length,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return children;
}
