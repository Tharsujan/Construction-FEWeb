"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/auth/LoginForm";
import { Alert, Field, buttonClass, inputClass } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { safeNext } from "@/lib/format";

export function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNext(search.get("next"));
  const { user, ready, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Open a customer account." lede="Name, phone, and a password of at least 6 characters.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name">
          <input required maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </Field>
        <Field label="Email">
          <input required type="email" maxLength={200} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
        </Field>
        <Field label="Phone">
          <input required maxLength={30} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" hint="At least 6 characters.">
          <input
            required
            type="password"
            minLength={6}
            maxLength={100}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </Field>
        {error ? <Alert>{error}</Alert> : null}
        <button type="submit" className={`${buttonClass()} w-full`} disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm">
        Already registered?{" "}
        <Link href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`} className="font-semibold text-clay hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
