"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Alert, Missing, Page, buttonClass, inputClass } from "@/components/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { Equipment, Rental } from "@/lib/types";

export function RentalRequest() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";

  return (
    <RequireAuth>
      <RentalForm id={id} />
    </RequireAuth>
  );
}

function RentalForm({ id }: { id: string }) {
  const router = useRouter();
  const { data, error, status, loading, reload } = useResource<Equipment>(id ? `/api/equipment/${id}` : null, false);
  const [startDate, setStartDate] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [deposit, setDeposit] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!id || loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading machine…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This machine is not listed"
        body="It may be in maintenance, or the link is out of date."
        href="/equipment"
        action="Back to equipment"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger">{error ?? "Could not load this machine."}</p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  if (data.status !== "Available") {
    return (
      <Page>
        <h1 className="font-display text-5xl">{data.name} is not available</h1>
        <p className="mt-4 max-w-xl text-muted">A rental request is only accepted while the machine status is available.</p>
        <Link href={`/equipment/${data.id}`} className={`${buttonClass("secondary")} mt-8`}>
          Back to the machine
        </Link>
      </Page>
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!data) return;
    if (expectedReturn < startDate) {
      setFormError("Expected return must be on or after the start date.");
      return;
    }
    const depositValue = Number(deposit);
    if (!Number.isFinite(depositValue) || depositValue < 0) {
      setFormError("Deposit must be zero or more.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const rental = await api<Rental>("/api/rentals", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: data.id,
          startDate,
          expectedReturn,
          siteAddress: siteAddress.trim(),
          deposit: depositValue,
        }),
      });
      router.push(`/rentals/${rental.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "The rental could not be requested.");
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <Link href={`/equipment/${data.id}`} className="text-sm font-semibold text-clay hover:underline">
        {data.code} · {data.name}
      </Link>
      <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Request a rental</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Daily rate {money(data.dailyRate)}. The hire total stays at zero until the yard marks the machine returned. Deposit can be zero.
      </p>

      <form onSubmit={submit} className="mt-8 grid max-w-xl gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Start date</span>
          <input type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Expected return</span>
          <input
            type="date"
            required
            min={startDate || undefined}
            value={expectedReturn}
            onChange={(event) => setExpectedReturn(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Site address</span>
          <textarea
            required
            maxLength={300}
            rows={3}
            value={siteAddress}
            onChange={(event) => setSiteAddress(event.target.value)}
            placeholder="Kandy Road, Kadawatha"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Deposit (Rs)</span>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={deposit}
            onChange={(event) => setDeposit(event.target.value)}
            className={inputClass}
          />
        </label>
        {formError ? <Alert>{formError}</Alert> : null}
        <button type="submit" className={buttonClass()} disabled={submitting || !startDate}>
          {submitting ? "Sending request…" : "Request rental"}
        </button>
      </form>
    </Page>
  );
}
