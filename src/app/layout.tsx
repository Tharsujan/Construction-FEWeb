import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { HeaderFallback, SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: {
    default: "Siteworks",
    template: "%s · Siteworks",
  },
  description: "Order cement, hire equipment, and follow upcoming and ongoing construction projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <Providers>
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeader />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
