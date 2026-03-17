import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Sakina",
  description: "Terms of service for the Sakina waitlist.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/" className="text-sm text-charcoal/50 hover:text-rose transition-colors">
        ← Back to Sakina
      </Link>

      <h1 className="font-headline mt-8 text-4xl font-light text-charcoal">Terms of Service</h1>
      <p className="mt-2 text-sm text-charcoal/50">Last updated: January 2026 · Pre-launch version</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.85] text-charcoal/70">
        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Waitlist terms</h2>
          <p className="mt-3">
            By joining the Sakina waitlist, you agree to receive email communications about the Sakina
            product launch. Joining the waitlist does not create a banking relationship, open an account,
            or guarantee access to Sakina services upon launch.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">No financial services</h2>
          <p className="mt-3">
            Sakina Financial Inc. is a financial technology company in pre-launch. No banking, payment,
            or financial services are currently offered. Joining the waitlist is not a financial transaction.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Founding member benefits</h2>
          <p className="mt-3">
            Founding member benefits (including cashback rates, fee waivers, and card priority) are
            subject to availability and may be modified prior to launch. Sakina will communicate any
            changes to founding members via email.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Unsubscribe</h2>
          <p className="mt-3">
            You may unsubscribe from waitlist communications at any time by clicking the unsubscribe
            link in any email or by contacting{" "}
            <a href="mailto:hello@sakina.io" className="text-rose hover:underline">hello@sakina.io</a>.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Contact</h2>
          <p className="mt-3">
            Sakina Financial Inc. · Colorado, United States ·{" "}
            <a href="mailto:hello@sakina.io" className="text-rose hover:underline">hello@sakina.io</a>
          </p>
        </section>
      </div>
    </main>
  );
}
