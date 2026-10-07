import type { Metadata } from "next";
import { Suspense } from "react";
import { RentalRequest } from "@/components/equipment/RentalRequest";

export const metadata: Metadata = { title: "Request rental" };

export default function RentPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Opening the request…</p>}>
      <RentalRequest />
    </Suspense>
  );
}
