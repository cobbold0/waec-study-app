import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AdRailsLayout } from "@/components/ads/AdRailsLayout";
import { ConsentManager } from "@/components/consent/consent-manager";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MONETIZATION } from "@/lib/monetization";
import { site } from "@/lib/site";
import "./globals.css";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Free WAEC Practice Questions`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GH",
    images: [
      {
        url: `${site.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${site.name} — Free WAEC Practice Questions`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${site.url}/opengraph-image`],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "google-adsense-account": adsenseClient,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1513" },
  ],
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto w-full flex-1 py-4">
          <AdRailsLayout>{children}</AdRailsLayout>
        </main>
        <SiteFooter />
        <ConsentManager gaId={gaId} adsenseClient={adsenseClient} />
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {MONETIZATION.astraPopunderUrl && (
          <Script
            src={MONETIZATION.astraPopunderUrl}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
