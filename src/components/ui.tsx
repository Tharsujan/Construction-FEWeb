import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { label } from "@/lib/format";

export function buttonClass(variant: "primary" | "secondary" | "quiet" = "primary") {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-clay text-card hover:bg-clay-deep",
    secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
    quiet: "border border-line bg-card text-ink hover:border-ink",
  };
  return `${base} ${variants[variant]}`;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" }) {
  return <button type={type} className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export const inputClass =
  "w-full border border-line bg-card px-3 py-2.5 text-base text-ink outline-none focus:border-clay";

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 py-10 sm:py-14 ${className}`}>{children}</div>;
}

export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">{kicker}</p>
      <h1 className="mt-2 font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl">{title}</h1>
      {lede ? <p className="mt-4 text-lg text-muted">{lede}</p> : null}
    </header>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="border border-[#e7c4bc] bg-[#fbf1ee] px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="border border-line bg-sand/60 px-3 py-2 text-sm text-ink">{children}</p>;
}

const BADGE_TONES: Record<string, string> = {
  Pending: "bg-[#f3e2c4] text-[#6a4a12]",
  Confirmed: "bg-[#dce8df] text-[#1e3a32]",
  OutForDelivery: "bg-[#f6d7c8] text-[#8a3412]",
  Delivered: "bg-hoarding text-paper",
  Cancelled: "bg-sand text-muted",
  Unpaid: "bg-[#f8e4e1] text-danger",
  Paid: "bg-[#dce8df] text-[#1e3a32]",
  Requested: "bg-[#f3e2c4] text-[#6a4a12]",
  Active: "bg-hoarding text-paper",
  Returned: "bg-sand text-ink",
  Available: "bg-[#dce8df] text-[#1e3a32]",
  Rented: "bg-[#f6d7c8] text-[#8a3412]",
  Planned: "bg-[#f3e2c4] text-[#6a4a12]",
  InProgress: "bg-hoarding text-paper",
  Completed: "bg-sand text-ink",
  OnHold: "bg-sand text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = BADGE_TONES[status] ?? "bg-sand text-ink";
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${tone}`}>
      {label(status)}
    </span>
  );
}

export function LoadState({
  loading,
  error,
  onRetry,
  label,
  children,
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  label: string;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <p className="py-16 text-muted" role="status">
        {label}
      </p>
    );
  }

  if (error) {
    return (
      <div className="border border-[#e7c4bc] bg-[#fbf1ee] p-5" role="alert">
        <p className="font-semibold text-danger">{error}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold underline">
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  return children;
}

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="border border-dashed border-line bg-card px-5 py-10">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-2 max-w-xl text-muted">{body}</p>
      {href && action ? (
        <Link href={href} className={`${buttonClass()} mt-6`}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function Missing({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <Page>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Not found</p>
      <h1 className="mt-2 font-display text-5xl leading-none">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{body}</p>
      <Link href={href} className={`${buttonClass("secondary")} mt-8`}>
        {action}
      </Link>
    </Page>
  );
}

export function FilterBar({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              selected
                ? "bg-ink px-3 py-1.5 text-sm font-semibold text-paper"
                : "border border-line bg-card px-3 py-1.5 text-sm text-muted hover:border-ink hover:text-ink"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
