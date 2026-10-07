"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { safeNext } from "@/lib/format";

export function AuthLayout({ title, lede, children }: { title: string; lede: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-hoarding px-10 py-12 text-paper lg:flex">
        <p className="font-display text-3xl tracking-wide">SITEWORKS</p>
        <div>
          <p className="max-w-md font-display text-6xl leading-[0.95]">{title}</p>
          <p className="mt-4 max-w-md text-lg text-paper/80">{lede}</p>
        </div>
        <p className="max-w-sm text-sm text-paper/70">Cement, equipment, and projects can be browsed before you sign in.</p>
      </aside>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 py-12">
        <h1 className="font-display text-5xl leading-none lg:sr-only">{title}</h1>
        <p className="mt-3 text-muted lg:hidden">{lede}</p>
        <div className="mt-8 lg:mt-0">{children}</div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNext(search.get("next"));
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Sign in to order and hire." lede="Use the account you registered with the yard.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </Field>
        {error ? <Alert>{error}</Alert> : null}
        <button type="submit" className={`${buttonClass()} w-full`} disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-6 text-sm text-muted">Local yard account: client@construction.local / Client@12345</p>
      ) : null}
      <p className="mt-4 text-sm">
        New here?{" "}
        <Link href={next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`} className="font-semibold text-clay hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
