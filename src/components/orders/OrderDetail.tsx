"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { Missing, Page, StatusBadge, buttonClass } from "@/components/ui";
import { formatDateTime, formatQty, money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { CementOrder } from "@/lib/types";

export function OrderDetail({ id }: { id: string }) {
  return (
    <RequireAuth>
      <OrderBody id={id} />
    </RequireAuth>
  );
}

function OrderBody({ id }: { id: string }) {
  const { data, error, status, loading, reload } = useResource<CementOrder>(`/api/cement/orders/${id}`, true);

  if (loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading order…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This order is not on your account"
        body="It may belong to someone else, or the link is wrong."
        href="/orders"
        action="Back to my orders"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger" role="alert">
          {error ?? "Could not load this order."}
        </p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/orders" className="text-sm font-semibold text-clay hover:underline">
        All orders
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={data.status} />
        <StatusBadge status={data.paymentStatus} />
      </div>
      <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Order {money(data.total)}</h1>
      <p className="mt-3 text-muted">Placed {formatDateTime(data.createdAt)}. The yard updates the status. You cannot change it here.</p>

      <dl className="mt-8 grid gap-4 border-y border-line py-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">Delivery address</dt>
          <dd className="mt-1 font-semibold">{data.deliveryAddress}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Project</dt>
          <dd className="mt-1 font-semibold">
            {data.projectId && data.projectName ? (
              <Link href={`/projects/${data.projectId}`} className="hover:text-clay">
                {data.projectName}
              </Link>
            ) : (
              "Not attached"
            )}
          </dd>
        </div>
      </dl>

      <h2 className="mt-8 font-display text-3xl">Lines</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {data.items.map((item) => (
          <li key={item.productId} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-sm text-muted">
                {formatQty(item.quantity)} × {money(item.unitPrice)}
              </p>
            </div>
            <p className="tabular-nums font-semibold">{money(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-display text-4xl tabular-nums">{money(data.total)}</p>
    </Page>
  );
}
