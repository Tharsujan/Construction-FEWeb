import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Opening registration…</p>}>
      <RegisterForm />
    </Suspense>
  );
}
