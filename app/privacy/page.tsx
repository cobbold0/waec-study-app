import type { Metadata } from "next";
import { CookieSettings } from "@/components/consent/cookie-settings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles your data: progress is stored on your device and no account is required.`,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <p>You can use {site.name} without creating an account or giving us your name, email or phone number.</p>
      <h2 className="pt-2 text-xl font-bold">Your progress stays on your device</h2>
      <p>
        Your answers, scores and study sessions are saved in your browser&apos;s local storage on this device.
        They are not sent to our servers. Clearing your browser data, or using &quot;Reset progress&quot; on
        the progress page, deletes them.
      </p>
      <h2 className="pt-2 text-xl font-bold">Analytics</h2>
      <p>
        If you accept cookies, we use Google Analytics to understand how the site is used, for example which pages are visited,
        how many practice sessions are started and completed, and overall accuracy. Google Analytics uses
        cookies and collects standard technical information such as device type, browser and approximate
        location. We do not send your answers, question text or any personal details to Google Analytics.
      </p>
      <h2 className="pt-2 text-xl font-bold">Advertising</h2>
      <p>
        The site shows advertising from Google AdSense to keep it free. If you accept cookies, ads may be
        personalised to your interests. If you decline or do not choose, you still see ads, but they are
        non-personalised: Google does not use your browsing history to choose them, though it may still use
        cookies for limited purposes such as frequency capping and fraud prevention. Ads are always labelled
        and never placed inside the question-answering area.
      </p>
      <h2 id="cookies" className="pt-2 text-xl font-bold">Cookies and your choice</h2>
      <p>
        Google Analytics loads only if you accept cookies in the banner, and ads are only personalised if you
        accept. If you decline, the site works exactly the same. Your choice is saved on this device.
      </p>
      <CookieSettings />
      <h2 className="pt-2 text-xl font-bold">Changes</h2>
      <p>If we add features such as accounts, we will update this page before they go live.</p>
    </article>
  );
}
