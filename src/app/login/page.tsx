import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Opening sign in…</p>}>
      <LoginForm />
    </Suspense>
  );
}
