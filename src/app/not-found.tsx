import Link from "next/link";
import { buttonClass, Page } from "@/components/ui";

export default function NotFound() {
  return (
    <Page>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">404</p>
      <h1 className="mt-2 font-display text-5xl leading-none">That page is not on the yard.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">The link may be old, or the page was never part of the customer site.</p>
      <Link href="/" className={`${buttonClass()} mt-8`}>
        Back home
      </Link>
    </Page>
  );
}
