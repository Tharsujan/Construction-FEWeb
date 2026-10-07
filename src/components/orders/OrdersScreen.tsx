"use client";

import Link from "next/link";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState, FilterBar, LoadState, Page, PageHeader, StatusBadge } from "@/components/ui";
import { formatDateTime, formatQty, money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { CementOrder } from "@/lib/types";

const FILTERS = [
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "OutForDelivery", label: "Out for delivery" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

export function OrdersScreen() {
  return (
    <RequireAuth>
      <OrdersList />
    </RequireAuth>
  );
}

function OrdersList() {
  const [status, setStatus] = useState("");
  const path = status ? `/api/cement/orders?status=${status}` : "/api/cement/orders";
  const { data, error, loading, reload } = useResource<CementOrder[]>(path, true);

  return (
    <Page>
      <PageHeader
        kicker="Orders"
        title="Your cement orders"
        lede="Only orders placed on this account. Status is set by the yard."
      />
      <div className="mt-8">
        <FilterBar label="Order status" value={status} onChange={setStatus} options={FILTERS} />
      </div>
      <div className="mt-8">
        <LoadState loading={loading} error={error} onRetry={reload} label="Loading orders…">
          {data && data.length === 0 ? (
            <EmptyState
              title={status ? "Nothing in this status" : "No orders yet"}
              body={status ? "Try another status, or place a new order from the cart." : "When you check out, the order will show up here."}
              href="/cement"
              action="Browse cement"
            />
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {data?.map((order) => (
                <li key={order.id}>
                  <Link href={`/orders/${order.id}`} className="block py-5 hover:bg-sand/40">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.paymentStatus} />
                      <span className="ml-auto font-display text-3xl tabular-nums">{money(order.total)}</span>
                    </div>
                    <p className="mt-3 font-semibold">{order.deliveryAddress}</p>
                    <p className="mt-1 text-sm text-muted">{formatDateTime(order.createdAt)}</p>
                    <p className="mt-2 text-sm">
                      {order.items.map((item) => `${item.productName} × ${formatQty(item.quantity)}`).join(", ")}
                    </p>
                    {order.projectName ? <p className="mt-2 text-sm text-muted">For {order.projectName}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </LoadState>
      </div>
    </Page>
  );
}
