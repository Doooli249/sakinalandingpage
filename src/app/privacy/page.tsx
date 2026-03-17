import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Sakina",
  description: "How Sakina handles your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/" className="text-sm text-charcoal/50 hover:text-rose transition-colors">
        ← Back to Sakina
      </Link>

      <h1 className="font-headline mt-8 text-4xl font-light text-charcoal">Privacy Policy</h1>
      <p className="mt-2 text-sm text-charcoal/50">Last updated: January 2026 · Pre-launch version</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.85] text-charcoal/70">
        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">What we collect</h2>
          <p className="mt-3">
            When you join the Sakina waitlist, we collect your first name, email address, and any optional motivation
            you choose to share. We do not collect payment information, Social Security numbers, or any financial
            data during the pre-launch waitlist phase.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">How we use it</h2>
          <p className="mt-3">
            Your information is used solely to send you launch updates, early access notifications, and founding
            member communications related to Sakina. We will never sell, rent, or share your information with
            third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Data storage</h2>
          <p className="mt-3">
            Waitlist data is stored securely via Supabase on servers located in the United States. We apply
            industry-standard encryption at rest and in transit.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Your rights</h2>
          <p className="mt-3">
            You may request deletion of your waitlist data at any time by emailing{" "}
            <a href="mailto:hello@sakina.io" className="text-rose hover:underline">hello@sakina.io</a>.
            We will process deletion requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-medium text-charcoal">Contact</h2>
          <p className="mt-3">
            For privacy-related questions, contact us at{" "}
            <a href="mailto:hello@sakina.io" className="text-rose hover:underline">hello@sakina.io</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
